import React from 'react';
import { useGakuen } from '../context/GakuenContext';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const DomainDeck: React.FC = () => {
  const { slides, activeSlideIndex, setActiveSlideIndex, setIsQuizActive } = useGakuen();
  const currentSlide = slides[activeSlideIndex];

  const handlePrev = () => {
    if (activeSlideIndex > 0) setActiveSlideIndex(activeSlideIndex - 1);
  };

  const handleNext = () => {
    if (activeSlideIndex < slides.length - 1) setActiveSlideIndex(activeSlideIndex + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
          The Domain Deck <span className="text-white/10 ml-2">// Navigation Interface</span>
        </h3>
        <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <span>0{activeSlideIndex + 1}</span>
            <div className="h-[1px] w-8 bg-white/10"></div>
            <span>0{slides.length}</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-4 bg-gakuen-crimson/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative min-h-[400px] flex flex-col justify-center">
            <h2 className="text-7xl font-black uppercase tracking-tighter mb-8 leading-none opacity-90">
                {currentSlide.title}
            </h2>
            <p className="max-w-2xl text-xl text-white/40 font-light leading-relaxed mb-12">
                {currentSlide.content}
            </p>

            <div className="flex items-center gap-8">
                <div className="flex gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={activeSlideIndex === 0}
                        className="h-12 w-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 disabled:opacity-5 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={activeSlideIndex === slides.length - 1}
                        className="h-12 w-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 disabled:opacity-5 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <button
                    onClick={() => setIsQuizActive(true)}
                    className="group flex items-center gap-6 px-10 py-5 bg-gakuen-crimson text-white font-black uppercase tracking-[0.4em] text-[10px] hover:bg-red-600 transition-all shadow-2xl shadow-gakuen-crimson/20 active:scale-95"
                >
                    <Zap size={14} className="fill-white" />
                    Launch Placement Clash
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DomainDeck;
