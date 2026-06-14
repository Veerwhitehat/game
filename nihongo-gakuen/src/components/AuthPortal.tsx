import React, { useState } from 'react';
import { useGakuen } from '../context/GakuenContext';
import { ArrowRight } from 'lucide-react';

interface AuthPortalProps {
  onLogin: () => void;
}

const AuthPortal: React.FC<AuthPortalProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'Student' | 'Instructor'>('Student');
  const { setUserRole, setUserName } = useGakuen();
  const [tempName, setTempName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(activeTab);
    if (tempName) setUserName(tempName);
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020202] p-8 overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gakuen-crimson/5 blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gakuen-gold/5 blur-[100px] -z-10"></div>

      <div className="w-full max-w-lg space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
              <div className="h-[2px] w-12 bg-gakuen-crimson"></div>
              <span className="text-gakuen-white/40 font-bold uppercase tracking-[0.4em] text-[10px]">Security Interface</span>
          </div>
          <h1 className="text-6xl font-extralight tracking-tighter text-gakuen-white uppercase">
            Gakuen <span className="font-black text-gakuen-crimson">Core</span>
          </h1>
        </div>

        <div className="space-y-10">
            <div className="flex gap-8 border-b border-white/5 pb-2">
            <button
                onClick={() => setActiveTab('Student')}
                className={`text-xs font-bold uppercase tracking-[0.3em] transition-all relative ${
                activeTab === 'Student' ? 'text-gakuen-white' : 'text-white/20 hover:text-white/40'
                }`}
            >
                Cadet Entrance
                {activeTab === 'Student' && <div className="absolute -bottom-[10px] left-0 right-0 h-[2px] bg-gakuen-crimson"></div>}
            </button>
            <button
                onClick={() => setActiveTab('Instructor')}
                className={`text-xs font-bold uppercase tracking-[0.3em] transition-all relative ${
                activeTab === 'Instructor' ? 'text-gakuen-white' : 'text-white/20 hover:text-white/40'
                }`}
            >
                Faculty Uplink
                {activeTab === 'Instructor' && <div className="absolute -bottom-[10px] left-0 right-0 h-[2px] bg-gakuen-gold"></div>}
            </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
            <div className="group border-b border-white/10 focus-within:border-gakuen-crimson transition-colors py-4">
                <label className="block text-[8px] font-black uppercase tracking-[0.5em] text-white/30 mb-2 group-focus-within:text-gakuen-crimson transition-colors">
                {activeTab === 'Student' ? 'Ident' : 'Access Code'}
                </label>
                <input
                type="text"
                required
                placeholder={activeTab === 'Student' ? "Shinji Ikari" : "Instructor Code"}
                className="w-full bg-transparent text-gakuen-white text-lg font-light outline-none placeholder:text-white/10"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                />
            </div>

            <div className="group border-b border-white/10 focus-within:border-gakuen-crimson transition-colors py-4">
                <label className="block text-[8px] font-black uppercase tracking-[0.5em] text-white/30 mb-2 group-focus-within:text-gakuen-crimson transition-colors">
                Master Key
                </label>
                <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-transparent text-gakuen-white text-lg font-light outline-none placeholder:text-white/10"
                />
            </div>

            <button type="submit" className="group flex items-center gap-4 text-gakuen-white hover:text-gakuen-crimson transition-colors pt-4">
                <span className="text-xs font-black uppercase tracking-[0.4em]">Initialize Session</span>
                <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gakuen-crimson transition-all">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </button>
            </form>
        </div>

        <div className="pt-12 text-[8px] text-white/10 uppercase tracking-[0.5em] leading-relaxed max-w-[300px]">
          Linguistic excellence is the only metric for academy progression.
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;
