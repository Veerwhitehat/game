import React, { useState } from 'react';
import { Lock, Unlock, AlertCircle } from 'lucide-react';
import TransmitDoneScroll from './TransmitDoneScroll';

const WeeklyTermHub: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() - 1);
  const [showCramWarning, setShowCramWarning] = useState(false);

  const days = [
    { name: 'Monday', id: 0, topic: 'Kanji Foundation' },
    { name: 'Tuesday', id: 1, topic: 'Verb Conjugation' },
    { name: 'Wednesday', id: 2, topic: 'Particle Physics' },
    { name: 'Thursday', id: 3, topic: 'Manga Syntax' },
    { name: 'Friday', id: 4, topic: 'Final Evaluation' },
  ];

  const currentHour = new Date().getHours();
  const todayIndex = new Date().getDay() - 1;

  const isUnlocked = (dayIndex: number) => {
    if (dayIndex < todayIndex) return true;
    if (dayIndex === todayIndex && currentHour >= 5) return true;
    return false;
  };

  const handleDayClick = (index: number) => {
    if (!isUnlocked(index)) {
      setShowCramWarning(true);
    } else {
      setSelectedDay(index);
    }
  };

  return (
    <div className="py-12 space-y-24">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-gakuen-gold"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.6em] text-gakuen-gold">Academy Chronology</span>
          </div>
          <h2 className="text-4xl font-extralight uppercase tracking-tighter">Weekly <span className="font-black">Term Hub</span></h2>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Spring Term • Tactical Phase</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-white/5 border border-white/5">
        {days.map((day, index) => {
          const unlocked = isUnlocked(index);
          const active = selectedDay === index;

          return (
            <button
              key={day.id}
              onClick={() => handleDayClick(index)}
              className={`group relative p-8 text-left transition-all duration-700 bg-[#050505] ${
                active ? 'z-10' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex justify-between items-start mb-12">
                <p className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-gakuen-crimson' : 'text-white/20'}`}>
                    0{index + 1}
                </p>
                {!unlocked ? (
                    <Lock size={12} className="text-white/10" />
                ) : (
                    active ? <div className="h-1.5 w-1.5 rounded-full bg-gakuen-crimson shadow-[0_0_8px_rgba(208,0,0,1)]"></div> : <Unlock size={12} className="text-green-500/30" />
                )}
              </div>

              <div className="space-y-1">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${active ? 'text-gakuen-white' : 'text-white/20'}`}>
                    {day.name}
                </p>
                <h4 className={`text-sm font-medium uppercase tracking-tight transition-colors ${active ? 'text-gakuen-white' : 'text-white/40 group-hover:text-white/60'}`}>
                    {day.topic}
                </h4>
              </div>

              {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gakuen-crimson"></div>}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 pt-12">
        <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gakuen-crimson">Current Task</span>
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">{days[selectedDay].topic}</h2>
              <p className="text-xl text-white/40 font-light leading-relaxed uppercase tracking-tight max-w-2xl">
                  Linguistic asset refinement requires consistent tactical repetition. Complete the physical worksheets. Precision threshold: 95%.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/5">
                <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Tactical Target</p>
                    <p className="text-2xl font-black text-gakuen-white uppercase tracking-tighter">250 Kanji Ops</p>
                </div>
                <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Temporal Limit</p>
                    <p className="text-2xl font-black text-gakuen-white uppercase tracking-tighter">23:59 Terminal</p>
                </div>
            </div>
        </div>

        <div className="lg:col-span-5">
          <TransmitDoneScroll />
        </div>
      </div>

      {showCramWarning && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-12 text-center">
          <div className="max-w-2xl space-y-12">
            <AlertCircle size={64} className="mx-auto text-gakuen-crimson opacity-50" />
            <div className="space-y-4">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-gakuen-crimson">Critical Restraint</h2>
                <p className="text-xl text-white/40 font-light uppercase tracking-widest leading-relaxed">
                Cognitive skill acquisition requires strict neural rest cycles. Cramming multi-day blocks destroys long-term retention.
                </p>
            </div>
            <button
              onClick={() => setShowCramWarning(false)}
              className="btn-crimson"
            >
              Acknowledge Directive
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyTermHub;
