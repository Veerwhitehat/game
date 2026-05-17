from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

VIDEO_DIR = 'videos'
DATA_FILE = 'data.json'

if not os.path.exists(VIDEO_DIR):
    os.makedirs(VIDEO_DIR)

def load_data():
    if not os.path.exists(DATA_FILE):
        return {
            "streaks": 0,
            "last_recorded_date": None,
            "streak_freezes": 0,
            "theme": "light",
            "notes": {},
            "total_recorded": 0
        }
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def update_streak_logic(data):
    today = datetime.now().date()
    last_recorded_date_str = data.get('last_recorded_date')

    if not last_recorded_date_str:
        return data

    last_recorded_date = datetime.strptime(last_recorded_date_str, '%Y-%m-%d').date()
    days_since = (today - last_recorded_date).days

    if days_since <= 1:
        # Streak is current or was updated today
        return data

    # Check for streak freezes
    missed_days = days_since - 1
    freezes_to_use = min(missed_days, data.get('streak_freezes', 0))

    if freezes_to_use >= missed_days:
        data['streak_freezes'] -= missed_days
        # Move last_recorded_date forward to "yesterday" to show freezes were applied
        data['last_recorded_date'] = (today - timedelta(days=1)).strftime('%Y-%m-%d')
    else:
        # Not enough freezes
        data['streaks'] = 0
        # Optional: update last_recorded_date to avoid repeated resets?
        # No, if they haven't recorded, it stays old.

    return data

@app.route('/', methods=['GET'])
def index():
    return send_from_directory('.', 'Daily_Reflection.html')

@app.route('/sw.js', methods=['GET'])
def sw():
    return send_from_directory('.', 'sw.js')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/stats', methods=['GET'])
def get_stats():
    data = load_data()
    data = update_streak_logic(data)
    save_data(data)
    return jsonify(data)

@app.route('/stats', methods=['POST'])
def update_stats():
    new_stats = request.json
    data = load_data()
    # Update only allowed fields
    for key in ['theme', 'streak_freezes', 'notes']:
        if key in new_stats:
            if key == 'notes':
                data['notes'].update(new_stats['notes'])
            else:
                data[key] = new_stats[key]
    save_data(data)
    return jsonify(data)

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files['video']
    today_dt = datetime.now()
    today = today_dt.strftime('%Y-%m-%d')
    filename = f"{today}.webm"
    filepath = os.path.join(VIDEO_DIR, filename)

    if os.path.exists(filepath):
        return jsonify({"error": "You have already recorded today. Come back tomorrow!"}), 400

    video_file.save(filepath)

    # Update metadata
    data = load_data()
    data['total_recorded'] += 1

    # Give a streak freeze every 5 recordings
    if data['total_recorded'] % 5 == 0:
        data['streak_freezes'] += 1

    last_date_str = data.get('last_recorded_date')
    if last_date_str:
        last_date = datetime.strptime(last_date_str, '%Y-%m-%d').date()
        days_diff = (today_dt.date() - last_date).days
        if days_diff == 1:
            data['streaks'] += 1
        elif days_diff > 1:
            # Check if freezes were used (this happens in get_stats usually)
            # But if we upload today, we should account for the gap
            missed_days = days_diff - 1
            if data['streak_freezes'] >= missed_days:
                data['streak_freezes'] -= missed_days
                data['streaks'] += 1
            else:
                data['streaks'] = 1 # Reset to 1 since we recorded today
    else:
        data['streaks'] = 1

    data['last_recorded_date'] = today
    save_data(data)

    return jsonify({"message": "Today's recording is done", "filename": filename})

@app.route('/videos', methods=['GET'])
def list_videos():
    data = load_data()
    videos = []
    for filename in sorted(os.listdir(VIDEO_DIR), reverse=True):
        if filename.endswith('.webm'):
            date = filename.split('.')[0]
            videos.append({
                "date": date,
                "url": f"/videos/{filename}",
                "note": data['notes'].get(date, "")
            })
    return jsonify(videos)

@app.route('/videos/<date>', methods=['DELETE'])
def delete_video(date):
    today = datetime.now().strftime('%Y-%m-%d')
    if date != today:
        return jsonify({"error": "Previous recordings cannot be deleted."}), 403

    filename = f"{date}.webm"
    filepath = os.path.join(VIDEO_DIR, filename)

    if os.path.exists(filepath):
        os.remove(filepath)
        data = load_data()
        data['total_recorded'] -= 1
        # If we delete today's video, last_recorded_date should probably revert?
        # That's complex, but for now let's just decrement count and remove note
        if data['last_recorded_date'] == date:
            # Find the previous recording
            recordings = sorted([f.split('.')[0] for f in os.listdir(VIDEO_DIR) if f.endswith('.webm')], reverse=True)
            data['last_recorded_date'] = recordings[0] if recordings else None
            # Streak might need to decrement if it was just increased
            if data['streaks'] > 0:
                data['streaks'] -= 1

        if date in data['notes']:
            del data['notes'][date]

        save_data(data)
        return jsonify({"message": "Recording deleted successfully."})
    else:
        return jsonify({"error": "Recording not found."}), 404

@app.route('/videos/<filename>', methods=['GET'])
def get_video(filename):
    return send_from_directory(VIDEO_DIR, filename)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
