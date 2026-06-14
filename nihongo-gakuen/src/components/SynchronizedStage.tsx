import React from 'react';
import { useGakuen } from '../context/GakuenContext';

const SynchronizedStage: React.FC = () => {
  const { slides, activeSlideIndex } = useGakuen();
  const currentSlide = slides[activeSlideIndex];

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <div className="h-[1px] w-12 bg-gakuen-gold/40"></div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gakuen-gold/40">
          Visual Synchronization Hub
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          <div className="relative aspect-video bg-gakuen-charcoal/20 border border-white/5 flex flex-col justify-center items-center text-center p-12 overflow-hidden group">
            <div className="absolute top-8 left-8">
                <span className="text-[8px] font-black uppercase tracking-[0.6em] text-white/20">Primary Matrix</span>
            </div>

            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_3px)]"></div>

            <h2 className="text-6xl font-black uppercase tracking-tighter mb-8 transition-transform duration-1000 group-hover:scale-[1.02]">
              {currentSlide.title}
            </h2>
            <div className="h-[2px] w-16 bg-gakuen-crimson mb-10"></div>
            <p className="max-w-xl text-xl text-white/40 font-light leading-relaxed uppercase tracking-tight">
              {currentSlide.content}
            </p>

            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-white/10 m-4"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-white/10 m-4"></div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="relative aspect-square bg-[#080808] border border-white/5 flex items-center justify-center group overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gakuen-crimson">Faculty Cam</span>
            </div>
            <div className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="w-2 h-2 bg-gakuen-crimson rounded-full animate-pulse"></div>
            </div>
            <div className="absolute inset-0 bg-gakuen-navy/20"></div>
          </div>

          <div className="p-8 border border-white/5 bg-gakuen-charcoal/10 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gakuen-gold/40">Transmission Log</h4>
            <p className="text-[11px] text-white/40 leading-relaxed font-light italic uppercase tracking-widest">
              "Tactical precision is non-negotiable. Focus on the core syntax."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SynchronizedStage;
