import React, { useState, useEffect } from 'react';
import { useGakuen } from '../context/GakuenContext';
import { ChevronRight } from 'lucide-react';

const PlacementClash: React.FC = () => {
  const { setIsQuizActive, submitScore, userName } = useGakuen();
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<'QUIZ' | 'VERIFY'>('QUIZ');
  const [reportedScore, setReportedScore] = useState<number>(0);

  useEffect(() => {
    if (timeLeft > 0 && phase === 'QUIZ') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && phase === 'QUIZ') {
      setPhase('VERIFY');
    }
  }, [timeLeft, phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitScore(userName, reportedScore);
    setIsQuizActive(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020202] flex items-center justify-center p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(208,0,0,0.05)_0%,transparent_70%)]"></div>

      <div className="w-full max-w-5xl relative space-y-12">
        <div className="flex justify-between items-end border-b border-white/5 pb-8">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-gakuen-crimson rounded-full animate-ping"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gakuen-crimson">Lockdown State Active</span>
                </div>
                <h1 className="text-6xl font-black italic tracking-tighter text-gakuen-white uppercase">Placement Clash</h1>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] mb-2">Temporal Limit</p>
                <div className="text-4xl font-black font-mono tracking-tighter">
                    <span className={timeLeft < 10 ? 'text-gakuen-crimson' : 'text-gakuen-white'}>00:{timeLeft.toString().padStart(2, '0')}</span>
                </div>
            </div>
        </div>

        <div className="min-h-[500px] flex flex-col justify-center relative">
            {phase === 'QUIZ' ? (
                <div className="space-y-12 max-w-3xl">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-extralight uppercase tracking-tight leading-tight">
                            Translate the instructor's <span className="font-black text-gakuen-gold">tactical command</span> into written formal Kanji.
                        </h2>
                    </div>
                    <div className="p-10 bg-white/[0.02] border border-white/5 relative group">
                        <div className="absolute top-0 left-0 h-full w-[2px] bg-gakuen-gold"></div>
                        <p className="text-gakuen-gold font-mono text-xl tracking-tighter leading-relaxed">
                            "Immediate strategic deployment of linguistic assets is required for Gakuen victory."
                        </p>
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black uppercase tracking-tight">Honor Verification</h2>
                        <p className="text-white/40 font-light text-xl leading-relaxed uppercase tracking-widest">
                            The Lockdown has expired. Calibrate your performance against the academy standard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gakuen-gold">
                                Metric Submission [0-5]
                            </label>
                            <div className="flex gap-4">
                                {[0,1,2,3,4,5].map(v => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => setReportedScore(v)}
                                        className={`h-16 w-16 border flex items-center justify-center text-xl font-black transition-all ${
                                            reportedScore === v ? 'bg-gakuen-gold text-gakuen-navy border-gakuen-gold shadow-2xl shadow-gakuen-gold/20' : 'border-white/10 text-white/40 hover:border-white/30'
                                        }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-gakuen-crimson/5 border-l border-gakuen-crimson relative">
                            <p className="text-[11px] text-white/60 font-light uppercase tracking-[0.3em] leading-loose italic">
                                <span className="text-gakuen-crimson font-black block mb-2 not-italic">The Warrior's Creed:</span>
                                HONOR CODE: Forging false metrics cheats your own progression. Report your true score honestly so the Gakuen database can calibrate and deploy remedies.
                            </p>
                        </div>

                        <button type="submit" className="group flex items-center gap-6 text-gakuen-white hover:text-gakuen-gold transition-colors">
                            <span className="text-xs font-black uppercase tracking-[0.5em]">Sync Metric & Return</span>
                            <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gakuen-gold transition-all">
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PlacementClash;
