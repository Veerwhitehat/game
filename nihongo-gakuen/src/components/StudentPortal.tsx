import React from 'react';
import { useGakuen } from '../context/GakuenContext';
import { Bell } from 'lucide-react';
import SynchronizedStage from './SynchronizedStage';
import PlacementClash from './PlacementClash';

const StudentPortal: React.FC = () => {
  const { userName, userRank, isQuizActive, notifications } = useGakuen();

  return (
    <div className="min-h-screen bg-[#050505] text-gakuen-white p-8 md:p-12">
      {/* Sleek Minimal Header */}
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-6">
          <div className="h-14 w-14 bg-white/5 border border-white/10 flex items-center justify-center rounded-full">
            <span className="text-gakuen-gold font-black text-xl">{userName[0]}</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extralight uppercase tracking-tighter">{userName}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gakuen-gold">{userRank} Cadet</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
            <div className="relative group cursor-pointer">
                <Bell size={20} className={notifications.length > 0 ? "text-gakuen-crimson animate-bounce" : "text-white/20 hover:text-white transition-colors"} />
                {notifications.length > 0 && (
                    <div className="absolute top-full right-0 mt-6 w-80 bg-gakuen-charcoal/80 backdrop-blur-2xl border border-white/5 p-6 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <p className="text-[10px] text-gakuen-crimson font-black uppercase tracking-[0.4em] mb-4">Command Notifications</p>
                        <ul className="space-y-4">
                            {notifications.map((note, i) => (
                                <li key={i} className="text-[10px] leading-relaxed text-white/60 border-l border-gakuen-crimson pl-4">{note}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Academy Uplink</p>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active Sync</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <SynchronizedStage />
      </div>

      {isQuizActive && <PlacementClash />}
    </div>
  );
};

export default StudentPortal;
