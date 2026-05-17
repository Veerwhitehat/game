# Daily Reflection App

Daily Reflection is a desktop-style web application designed to help you capture short daily video reflections.

## Features
- **Daily Video Recording**: 2-7 minute recording limit.
- **Streak Tracking**: Automatic streak freezes for missed days.
- **Library**: Grid view of all recordings with random thumbnails.
- **Theme**: Dark and Light mode support.
- **Notes**: Add text notes to your daily reflections.
- **Export**: Download your videos to your local machine.
- **Search & Filter**: Find reflections by date or content.

## Setup Instructions

### 1. Prerequisites
Ensure you have **Python 3.12+** installed on your system.

### 2. Install Dependencies
Navigate to the project directory and install the required Python packages:
```bash
pip install flask flask-cors
```

### 3. Run the Server
Start the backend server:
```bash
python server.py
```
The server will start on `http://localhost:5000`.

### 4. Access the Application
Open your web browser and go to:
[http://localhost:5000](http://localhost:5000)

## Project Structure
- `Daily_Reflection.html`: The main application frontend.
- `server.py`: Flask backend handling storage and logic.
- `videos/`: Directory where your recordings are saved.
- `data.json`: Stores your streaks, freezes, and notes.
- `sw.js`: Service worker for offline asset caching.
