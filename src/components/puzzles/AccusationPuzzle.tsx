import React, { useState } from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';

interface AccusationPuzzleProps {
  onAccuse: (suspect: string) => { success: boolean };
}

const SUSPECTS = [
  { id: 'FIRMIN', label: 'FIRMIN', desc: 'Le valet serviable et lâche' },
  { id: 'ARMAND', label: 'ARMAND', desc: 'Le mari arrogant et avide' },
  { id: 'BÉATRICE', label: 'BÉATRICE', desc: 'La victime brillante' },
  { id: 'PERSONNE', label: 'PERSONNE', desc: 'Une disparition simulée sans meurtre' },
];

export const AccusationPuzzle: React.FC<AccusationPuzzleProps> = ({ onAccuse }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    const res = onAccuse(selected);
    if (!res.success) {
      setError(true);
    }
  };

  return (
    <div className="bg-[#1c1a18] border-2 border-red-700/80 rounded-xl p-5 shadow-2xl my-4 text-[#e8e2d5] animate-fade-in">
      <div className="flex items-center gap-2 mb-2 text-red-500">
        <ShieldAlert className="w-6 h-6" />
        <h2 className="text-lg font-black font-serif uppercase tracking-wider">
          QUI A TUÉ BÉATRICE ?
        </h2>
      </div>

      <p className="text-xs text-[#8c8376] mb-5 font-serif">
        Vous avez réuni toutes les preuves. Portez votre accusation finale.
      </p>

      <div className="space-y-2.5 mb-6">
        {SUSPECTS.map((suspect) => (
          <button
            key={suspect.id}
            onClick={() => {
              setSelected(suspect.id);
              setError(false);
            }}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              selected === suspect.id
                ? 'border-red-600 bg-red-950/70 shadow-lg shadow-red-950/50 scale-[1.01]'
                : 'border-[#3a3530] bg-[#221f1c] hover:border-red-800/40'
            }`}
          >
            <div className="font-serif font-bold text-base text-[#e8e2d5]">
              {suspect.label}
            </div>
            <div className="text-xs text-[#8c8376] mt-0.5">
              {suspect.desc}
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold bg-red-950/80 p-3 rounded border border-red-700 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Ce n'est pas la bonne personne. Analysez attentivement l'arme et les comportements.</span>
        </div>
      )}

      <button
        disabled={!selected}
        onClick={handleConfirm}
        className={`w-full py-4 rounded-lg font-serif font-bold text-base tracking-wider uppercase shadow-xl transition-all ${
          selected
            ? 'bg-red-700 hover:bg-red-800 text-white cursor-pointer active:scale-98 shadow-red-900/50'
            : 'bg-[#2b2724] text-[#635c52] border border-[#38332e] cursor-not-allowed'
        }`}
      >
        CONFIRMER L'ACCUSATION
      </button>
    </div>
  );
};
