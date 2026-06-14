import React from 'react';
import { useGakuen } from '../context/GakuenContext';

const FacultySidebar: React.FC = () => {
  const { slides, activeSlideIndex, setActiveSlideIndex } = useGakuen();

  return (
    <div className="space-y-8">
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gakuen-gold/60 mb-6">
        Syllabus Deck
      </h3>

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlideIndex(index)}
            className="w-full text-left group flex items-start gap-4"
          >
            <div className="mt-1">
                <div className={`h-2 w-2 rounded-full transition-all duration-500 ${
                    activeSlideIndex === index ? 'bg-gakuen-crimson ring-4 ring-gakuen-crimson/20' : 'bg-white/10 group-hover:bg-white/30'
                }`}></div>
            </div>
            <div className="space-y-1">
                <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                    activeSlideIndex === index ? 'text-gakuen-white' : 'text-white/20'
                }`}>
                    Phase 0{index + 1}
                </p>
                <p className={`text-xs font-medium uppercase tracking-tight transition-colors ${
                    activeSlideIndex === index ? 'text-gakuen-white' : 'text-white/40 group-hover:text-white/60'
                }`}>
                    {slide.title}
                </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FacultySidebar;
