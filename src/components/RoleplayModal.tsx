import React from 'react';
import { PendingSpeech } from '../types/game';
import { Mask, UserCheck, Shield } from 'lucide-react';

interface RoleplayModalProps {
  speech: PendingSpeech | null;
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export const RoleplayModal: React.FC<RoleplayModalProps> = ({ speech, isOpen, onComplete, onClose }) => {
  if (!isOpen || !speech) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#1c1a18] border-2 border-[#c59b27] rounded-xl p-5 shadow-2xl relative text-[#e8e2d5]">
        {/* MJ Badge Header */}
        <div className="flex items-center justify-between border-b border-[#8f7223]/40 pb-3 mb-4">
          <div className="flex items-center gap-2 text-[#c59b27]">
            <Shield className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider font-serif">
              INTERFACE MAÎTRE DU JEU (MJ)
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-amber-950 border border-amber-600/50 text-amber-300 rounded font-mono">
            RÔLE : INCARNATION
          </span>
        </div>

        {/* Character Indicator */}
        <div className="text-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#9e2a2b] border-2 border-[#c59b27] flex items-center justify-center mx-auto mb-2 shadow-lg">
            <Mask className="w-8 h-8 text-amber-200" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#c59b27]">
            {speech.speaker}
          </h2>
          <p className="text-xs text-[#8c8376] uppercase tracking-wider font-semibold">
            {speech.title}
          </p>
        </div>

        {/* Instructions for MJ */}
        <div className="bg-amber-950/40 border border-amber-600/30 rounded-lg p-2.5 mb-4 text-center">
          <p className="text-xs text-amber-200 font-medium">
            🎭 <span className="font-bold">Consigne MJ :</span> Lisez le texte ci-dessous à voix haute aux joueurs en jouant le personnage avec intonation !
          </p>
        </div>

        {/* Speech Script Box */}
        <div className="paper-doc p-4 max-h-60 overflow-y-auto mb-5 text-sm text-gray-900 leading-relaxed font-serif whitespace-pre-line border border-[#c59b27]/40 shadow-inner">
          {speech.text}
        </div>

        {/* Completion Action */}
        <button
          onClick={onComplete}
          className="w-full py-3.5 bg-[#9e2a2b] hover:bg-[#b83234] text-white font-serif font-bold text-sm rounded-lg shadow-lg shadow-[#9e2a2b]/30 flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <UserCheck className="w-5 h-5" />
          <span>J'AI INCARNÉ LE PERSONNAGE — VALIDER</span>
        </button>
      </div>
    </div>
  );
};
