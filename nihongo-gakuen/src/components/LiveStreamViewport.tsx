import React from 'react';

const LiveStreamViewport: React.FC = () => {
  return (
    <div className="relative aspect-video bg-[#080808] border border-white/5 overflow-hidden group">
      {/* HUD Elements */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
        <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gakuen-crimson animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gakuen-crimson">Live Feed</span>
        </div>
        <div className="h-4 w-[1px] bg-white/10"></div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Encrypted Transmission</span>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 border-2 border-white/5 rounded-full flex items-center justify-center animate-[ping_3s_infinite] opacity-20">
            <div className="w-16 h-16 border-2 border-white/5 rounded-full"></div>
        </div>
        <div className="absolute text-center space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/10">Synchronizing Signal</p>
        </div>
      </div>

      {/* Visual Artifacts */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-20 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="space-y-1">
              <div className="h-1 w-24 bg-white/10"></div>
              <div className="h-1 w-12 bg-white/10"></div>
          </div>
          <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-4 w-1 ${i < 3 ? 'bg-gakuen-gold/40' : 'bg-white/5'}`}></div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default LiveStreamViewport;
