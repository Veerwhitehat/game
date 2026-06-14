import React, { useState, useRef } from 'react';
import { Camera, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react';
import { useGakuen } from '../context/GakuenContext';

const TransmitDoneScroll: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addSubmission, userName, userRank } = useGakuen();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setTimeout(() => {
          const now = new Date();
          const ts = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
          setTimestamp(ts);
          setIsUploading(false);
          setIsComplete(true);

          addSubmission({
            studentName: userName,
            rank: userRank,
            date: now.toISOString().split('T')[0],
            imageUrl: event.target?.result as string,
            maxScore: 8,
            status: 'Pending',
            rotation: 0
          });
        }, 2000);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`h-full flex flex-col justify-center transition-all duration-1000 ${
      isComplete ? 'bg-green-500/[0.02]' : ''
    }`}>
      {isComplete ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-4">
              <CheckCircle2 size={32} className="text-green-500" />
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-green-500">Transmission Success</h4>
                <p className="text-[10px] text-white/40 uppercase font-light tracking-widest leading-relaxed">
                    Linguistic Asset Stored in Academy Vault.
                </p>
              </div>
          </div>
          <div className="p-8 border border-white/5 bg-white/[0.01]">
              <p className="text-[8px] text-white/20 font-mono uppercase tracking-[0.4em]">Node-ACK: TS-{timestamp}-SECURE</p>
          </div>
          <button
            onClick={() => setIsComplete(false)}
            className="text-[10px] text-white/20 hover:text-white underline uppercase font-bold tracking-widest transition-colors"
          >
            Initiate New Link
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Uplink Interface</h4>
            <p className="text-sm text-white/60 font-light uppercase tracking-[0.2em] leading-relaxed">
                Transmit physical handwriting via secure academy uplink.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full h-32 border border-white/10 flex flex-col items-center justify-center gap-4 group relative hover:border-gakuen-crimson/40 transition-all duration-700"
            >
                {isUploading ? (
                    <Loader2 size={32} className="animate-spin text-gakuen-crimson" />
                ) : (
                    <>
                        <Camera size={32} className="text-white/10 group-hover:text-gakuen-crimson group-hover:scale-110 transition-all duration-700" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-colors">Capture Asset</span>
                    </>
                )}
            </button>

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full flex items-center justify-between group border-b border-white/5 py-4 hover:border-white/20 transition-colors"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-colors">Manual File Select</span>
                <ArrowUpRight size={16} className="text-white/10 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            capture="environment"
            onChange={handleUpload}
          />
        </div>
      )}
    </div>
  );
};

export default TransmitDoneScroll;
