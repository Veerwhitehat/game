import React, { useState } from 'react';
import { useGakuen } from '../context/GakuenContext';
import { Search, RotateCw, Filter, X } from 'lucide-react';
import EvaluationHUD from './EvaluationHUD';

const FacultyEvaluationMatrix: React.FC = () => {
  const { submissions, updateSubmission } = useGakuen();
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState<number | null>(null);

  const activeSubmission = selectedSubmissionIndex !== null ? submissions[selectedSubmissionIndex] : null;

  const rotate = () => {
    if (selectedSubmissionIndex !== null && activeSubmission) {
      updateSubmission(selectedSubmissionIndex, {
        rotation: (activeSubmission.rotation + 90) % 360
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gakuen-white p-12">
      <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-gakuen-gold"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.6em] text-gakuen-gold">Asset Review Board</span>
          </div>
          <h2 className="text-5xl font-extralight uppercase tracking-tighter">Evaluation <span className="font-black">Matrix</span></h2>
        </div>

        <div className="flex items-center gap-8">
            <div className="relative group">
                <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gakuen-gold transition-colors" />
                <input
                    type="text"
                    placeholder="Search Cadets"
                    className="bg-transparent border-b border-white/5 p-2 pl-8 text-[10px] font-bold uppercase tracking-[0.3em] outline-none focus:border-gakuen-gold w-64 transition-all"
                />
            </div>
            <button className="text-white/20 hover:text-white transition-colors">
                <Filter size={20} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-12">
        {submissions.length === 0 ? (
            <div className="col-span-full py-40 text-center border border-dashed border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">Awaiting Synchronized Submissions</p>
            </div>
        ) : (
            submissions.map((sub, index) => (
                <div
                    key={index}
                    onClick={() => setSelectedSubmissionIndex(index)}
                    className="group cursor-pointer space-y-6"
                >
                    <div className="aspect-[4/5] bg-gakuen-charcoal border border-white/5 relative overflow-hidden transition-all duration-700 group-hover:border-white/20">
                        <img
                            src={sub.imageUrl}
                            alt="Submission"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            style={{ transform: `rotate(${sub.rotation}deg)` }}
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-700"></div>

                        <div className="absolute top-6 right-6">
                            <div className={`h-2 w-2 rounded-full ${
                                sub.status === 'Pending' ? 'bg-gakuen-gold shadow-[0_0_8px_rgba(255,215,0,0.5)]' :
                                sub.status === 'Pass' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gakuen-crimson shadow-[0_0_8px_rgba(208,0,0,0.5)]'
                            }`}></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] transition-colors group-hover:text-gakuen-gold">{sub.studentName}</p>
                        <div className="flex justify-between items-center text-[8px] text-white/20 font-black uppercase tracking-widest">
                            <span>{sub.rank}</span>
                            <span>{sub.date}</span>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {selectedSubmissionIndex !== null && activeSubmission && (
        <div className="fixed inset-0 z-[300] bg-black flex overflow-hidden">
            <div className="flex-1 flex flex-col relative">
                <div className="p-8 flex justify-between items-center border-b border-white/5">
                    <div className="flex items-center gap-8">
                        <button onClick={() => setSelectedSubmissionIndex(null)} className="text-white/20 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                        <div className="h-8 w-[1px] bg-white/5"></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">{activeSubmission.studentName}</p>
                            <p className="text-[8px] text-gakuen-gold font-bold uppercase tracking-[0.2em]">{activeSubmission.rank} • Submission Node</p>
                        </div>
                    </div>
                    <button
                        onClick={rotate}
                        className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
                    >
                        <RotateCw size={14} /> Rotate Matrix
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center p-16 overflow-hidden bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] bg-opacity-5">
                    <div
                        className="max-w-full max-h-full transition-transform duration-700 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                        style={{ transform: `rotate(${activeSubmission.rotation}deg)` }}
                    >
                        <img
                            src={activeSubmission.imageUrl}
                            alt="High Res"
                            className="max-w-[70vw] max-h-[60vh] object-contain border border-white/10"
                        />
                    </div>
                </div>
            </div>

            <div className="w-[450px] border-l border-white/5 bg-[#080808] overflow-y-auto">
                <EvaluationHUD
                    submission={activeSubmission}
                    onUpdate={(updates) => updateSubmission(selectedSubmissionIndex, updates)}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default FacultyEvaluationMatrix;
