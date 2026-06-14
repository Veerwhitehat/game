import React from 'react';
import FacultySidebar from './FacultySidebar';
import DomainDeck from './DomainDeck';
import GradebookHUD from './GradebookHUD';
import LiveStreamViewport from './LiveStreamViewport';

const FacultyConsole: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-gakuen-white p-8">
      {/* Sleek Header */}
      <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-gakuen-gold"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.6em] text-gakuen-gold">Administrative Node</span>
          </div>
          <h2 className="text-4xl font-extralight uppercase tracking-tighter">Faculty <span className="font-black">Console</span></h2>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Dr. Kaito • Lead Instructor</p>
          <div className="inline-block px-3 py-1 bg-gakuen-gold/10 border border-gakuen-gold/20 text-[8px] font-black text-gakuen-gold uppercase tracking-[0.2em]">
            NG-ADMIN-01
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Combined Syllabus & Stream (9 cols) */}
        <div className="lg:col-span-9 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 border-r border-white/5">
              <FacultySidebar />
            </div>
            <div className="md:col-span-3">
              <LiveStreamViewport />
            </div>
          </div>

          <div className="pt-12 border-t border-white/5">
            <DomainDeck />
          </div>
        </div>

        {/* Right: Gradebook (3 cols) */}
        <div className="lg:col-span-3">
          <GradebookHUD />
        </div>
      </div>
    </div>
  );
};

export default FacultyConsole;
