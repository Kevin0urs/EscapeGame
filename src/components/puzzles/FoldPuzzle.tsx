import React, { useState } from 'react';
import { Layers, Check, AlertCircle } from 'lucide-react';

interface FoldPuzzleProps {
  onSolve: (answer: string) => { success: boolean };
}

export const FoldPuzzle: React.FC<FoldPuzzleProps> = ({ onSolve }) => {
  const [hasFolded, setHasFolded] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    const res = onSolve(answer);
    if (!res.success) {
      setError(true);
    }
  };

  return (
    <div className="bg-[#24211e] border-2 border-[#c59b27]/60 rounded-xl p-5 shadow-xl my-4 text-[#e8e2d5] animate-fade-in">
      <div className="flex items-center gap-2 mb-3 text-[#c59b27]">
        <Layers className="w-5 h-5" />
        <h3 className="text-base font-bold font-serif uppercase tracking-wider">
          ÉNIGME DE LA CARTE PLIÉE (8♥)
        </h3>
      </div>

      {!hasFolded ? (
        <div className="space-y-4 my-3">
          <p className="text-xs text-[#8c8376] leading-relaxed font-serif">
            Cette carte semble avoir été conçue pour être manipulée. <br />
            <strong className="text-[#e8e2d5]">Pliez-la comme elle était à l'origine dans la maison.</strong>
          </p>

          <button
            onClick={() => setHasFolded(true)}
            className="w-full py-3.5 bg-[#9e2a2b] hover:bg-[#b83234] text-white font-serif font-bold text-sm rounded-lg shadow-lg shadow-[#9e2a2b]/30 flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-5 h-5" />
            <span>J'AI PLIÉ LA CARTE</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 my-3 animate-fade-in">
          <p className="text-xs font-serif text-[#c59b27] font-semibold">
            Quel lieu voyez-vous en observant la carte pliée ?
          </p>

          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError(false);
            }}
            placeholder="ex: BUREAU"
            className="w-full bg-[#181615] border border-[#8f7223]/50 p-3 rounded-lg text-[#e8e2d5] font-bold text-base focus:outline-none placeholder-[#635c52]"
            autoCapitalize="characters"
            autoCorrect="off"
          />

          {error && (
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold bg-red-950/60 p-2.5 rounded border border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Regardez attentivement ce que les plis rapprochent.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!answer.trim()}
            className={`w-full py-3 rounded-lg font-serif font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              answer.trim()
                ? 'bg-[#9e2a2b] hover:bg-[#b83234] text-white shadow-lg shadow-[#9e2a2b]/30'
                : 'bg-[#2b2724] text-[#635c52] cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>VALIDER LE LIEU</span>
          </button>
        </form>
      )}
    </div>
  );
};
