import React from 'react';
import { Award, RefreshCw, Mask } from 'lucide-react';
import { SPEECHES } from '../data/story';

interface EndScreenProps {
  onReset: () => void;
}

export const EndScreen: React.FC<EndScreenProps> = ({ onReset }) => {
  return (
    <div className="min-h-screen bg-[#141211] text-[#e8e2d5] p-5 flex flex-col justify-between max-w-lg mx-auto animate-fade-in relative">
      {/* Top Header */}
      <div className="text-center pt-6 pb-4">
        <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-xl">
          <Award className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-black font-serif text-[#c59b27] uppercase tracking-widest">
          AFFAIRE RÉSOLUE
        </h1>
        <p className="text-xs text-[#8c8376] uppercase tracking-wider font-semibold mt-1">
          L'enquête de Béatrice de Carreau
        </p>
      </div>

      {/* Main Beatrice Final Monologue Document */}
      <div className="paper-doc p-6 rounded-xl my-4 shadow-2xl border-2 border-[#c59b27] relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#d3ccbb]">
          <Mask className="w-5 h-5 text-red-800" />
          <h2 className="text-base font-bold font-serif text-gray-900">
            {SPEECHES.BEATRICE_FINAL.title}
          </h2>
        </div>

        <div className="text-sm text-gray-800 leading-relaxed font-serif whitespace-pre-line space-y-3">
          {SPEECHES.BEATRICE_FINAL.text}
        </div>
      </div>

      {/* End Banner & Reset */}
      <div className="text-center py-6">
        <h2 className="text-4xl font-black font-serif text-[#c59b27] tracking-widest mb-6 drop-shadow-md">
          FIN
        </h2>

        <button
          onClick={onReset}
          className="w-full py-4 bg-[#9e2a2b] hover:bg-[#b83234] text-white font-serif font-bold text-sm tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <RefreshCw className="w-5 h-5" />
          <span>RECOMMENCER L'ENQUÊTE</span>
        </button>
      </div>
    </div>
  );
};
