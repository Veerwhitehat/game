import React from 'react';
import { XCircle, Award, ExternalLink } from 'lucide-react';

interface EvaluationHUDProps {
  submission: any;
  onUpdate: (updates: any) => void;
}

const EvaluationHUD: React.FC<EvaluationHUDProps> = ({ submission, onUpdate }) => {
  const quickFeedback = [
    { label: 'Vowel Confusion', link: 'https://gakuen.edu/tactics/vowels' },
    { label: 'Kanji Stroke Error', link: 'https://gakuen.edu/tactics/strokes' },
    { label: 'Particle Misuse', link: 'https://gakuen.edu/tactics/particles' },
    { label: 'Elite Precision', link: 'https://gakuen.edu/hall-of-fame' },
  ];

  return (
    <div className="p-12 space-y-16">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gakuen-gold">
          Evaluation Node
        </h3>
        <div className="h-[1px] w-12 bg-gakuen-gold"></div>
      </div>

      <div className="space-y-8">
        <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
          Linguistic Precision
        </label>
        <div className="flex items-end gap-4">
            <input
                type="number"
                max={submission.maxScore}
                min={0}
                value={submission.score || ''}
                onChange={(e) => onUpdate({ score: parseInt(e.target.value) })}
                className="bg-transparent border-b-2 border-white/10 w-24 text-6xl font-black text-center focus:border-gakuen-gold outline-none transition-colors"
            />
            <span className="text-2xl font-light text-white/10 mb-2">/ {submission.maxScore}</span>
        </div>
      </div>

      <div className="space-y-8">
        <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
          Strategic Assessment
        </label>
        <div className="grid grid-cols-1 gap-4">
            <button
                onClick={() => onUpdate({ status: 'Pass' })}
                className={`group flex items-center justify-between p-6 border transition-all duration-700 ${
                    submission.status === 'Pass' ? 'bg-green-500/10 border-green-500/40 text-green-500' : 'border-white/5 text-white/20 hover:border-white/20 hover:text-white'
                }`}
            >
                <div className="flex items-center gap-4">
                    <Award size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Validate Phase</span>
                </div>
                <div className={`h-2 w-2 rounded-full ${submission.status === 'Pass' ? 'bg-green-500 animate-pulse' : 'bg-white/10'}`}></div>
            </button>
            <button
                onClick={() => onUpdate({ status: 'Fail' })}
                className={`group flex items-center justify-between p-6 border transition-all duration-700 ${
                    submission.status === 'Fail' ? 'bg-gakuen-crimson/10 border-gakuen-crimson/40 text-gakuen-crimson' : 'border-white/5 text-white/20 hover:border-white/20 hover:text-white'
                }`}
            >
                <div className="flex items-center gap-4">
                    <XCircle size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Initiate Reforge</span>
                </div>
                <div className={`h-2 w-2 rounded-full ${submission.status === 'Fail' ? 'bg-gakuen-crimson animate-pulse' : 'bg-white/10'}`}></div>
            </button>
        </div>
      </div>

      <div className="space-y-8 pt-16 border-t border-white/5">
        <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
          Tactical Knowledge Push
        </label>
        <div className="grid grid-cols-1 gap-2">
            {quickFeedback.map((item, i) => (
                <button
                    key={i}
                    onClick={() => onUpdate({ feedback: `RESOURCE DEPLOYED: ${item.label} - ${item.link}` })}
                    className="group flex items-center justify-between py-4 border-b border-white/[0.02] hover:border-gakuen-gold/20 transition-all"
                >
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 group-hover:text-gakuen-gold transition-colors">{item.label}</span>
                    <ExternalLink size={12} className="text-white/10 group-hover:text-gakuen-gold transition-colors" />
                </button>
            ))}
        </div>
      </div>

      {submission.feedback && (
          <div className="p-8 bg-gakuen-gold/[0.02] border border-gakuen-gold/10 animate-in fade-in slide-in-from-top-4 duration-1000">
              <p className="text-[8px] font-black text-gakuen-gold uppercase tracking-[0.4em] mb-4">Uplink Message Active</p>
              <p className="text-[10px] text-white/40 font-mono leading-relaxed">{submission.feedback}</p>
          </div>
      )}
    </div>
  );
};

export default EvaluationHUD;
