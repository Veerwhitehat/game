import React from 'react';
import { useGakuen } from '../context/GakuenContext';
import { AlertTriangle, MoreHorizontal } from 'lucide-react';

const GradebookHUD: React.FC = () => {
  const { studentScores, pushRemedial } = useGakuen();

  const students = [
    { name: 'Cadet Shinji', status: 'Online', rank: 'Class 1-C' },
    { name: 'Cadet Asuka', status: 'Online', rank: 'Class 1-A' },
    { name: 'Cadet Rei', status: 'Idle', rank: 'Class 1-B' },
  ];

  return (
    <div className="space-y-8 sticky top-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
          Gradebook HUD
        </h3>
        <button className="text-white/20 hover:text-white transition-colors">
            <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {students.map((student) => {
          const scoreData = studentScores[student.name];
          const scorePercent = scoreData ? (scoreData.score / 5) * 100 : null;
          const isWarning = scorePercent !== null && scorePercent < 75;

          return (
            <div key={student.name} className="group p-4 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-500">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">{student.name}</p>
                        <p className="text-[8px] text-white/20 font-bold uppercase">{student.rank}</p>
                    </div>
                    {isWarning ? (
                        <button
                            onClick={() => pushRemedial(student.name)}
                            className="h-8 w-8 bg-gakuen-crimson/10 border border-gakuen-crimson/20 text-gakuen-crimson flex items-center justify-center animate-pulse"
                        >
                            <AlertTriangle size={14} />
                        </button>
                    ) : (
                        <div className={`h-2 w-2 rounded-full mt-2 ${student.status === 'Online' ? 'bg-green-500' : 'bg-white/10'}`}></div>
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1">Status</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase">{student.status}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1">Precision</p>
                        <p className={`text-lg font-black ${isWarning ? 'text-gakuen-crimson' : scoreData ? 'text-gakuen-gold' : 'text-white/10'}`}>
                            {scoreData ? `${scoreData.score}/5` : '--'}
                        </p>
                    </div>
                </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-gakuen-crimson/5 border border-gakuen-crimson/10">
        <p className="text-[8px] text-gakuen-crimson font-black uppercase tracking-[0.2em] leading-relaxed">
            Threshold Alert: Automatic remedial deployment active for scores below 75%.
        </p>
      </div>
    </div>
  );
};

export default GradebookHUD;
