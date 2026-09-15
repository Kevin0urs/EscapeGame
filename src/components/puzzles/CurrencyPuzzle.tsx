import React, { useState } from 'react';
import { HelpCircle, Check, AlertCircle } from 'lucide-react';

interface CurrencyPuzzleProps {
  onSolve: (answer: string) => { success: boolean };
}

export const CurrencyPuzzle: React.FC<CurrencyPuzzleProps> = ({ onSolve }) => {
  const [hasFoundMoney, setHasFoundMoney] = useState<boolean | null>(null);
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
        <HelpCircle className="w-5 h-5" />
        <h3 className="text-base font-bold font-serif uppercase tracking-wider">
          AVEZ-VOUS TROUVÉ DE L'ARGENT ?
        </h3>
      </div>

      {hasFoundMoney === null && (
        <div className="space-y-3 my-4">
          <p className="text-xs text-[#8c8376]">
            Firmin a affirmé qu'Armand cachait régulièrement de l'argent dans la maison.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setHasFoundMoney(true)}
              className="flex-1 py-3 bg-[#9e2a2b] hover:bg-[#b83234] text-white font-serif font-bold text-sm rounded-lg shadow transition-colors"
            >
              OUI
            </button>
            <button
              onClick={() => setHasFoundMoney(false)}
              className="flex-1 py-3 bg-[#2d2824] hover:bg-[#3d3732] border border-[#3a3530] text-[#e8e2d5] font-serif font-bold text-sm rounded-lg transition-colors"
            >
              NON
            </button>
          </div>
        </div>
      )}

      {hasFoundMoney === false && (
        <div className="bg-[#1c1a18] p-4 rounded-lg border border-[#3a3530] text-center my-3 animate-fade-in">
          <p className="text-sm font-serif italic text-amber-200 mb-3">
            « Continuez de chercher dans les pièces de la maison. »
          </p>
          <button
            onClick={() => setHasFoundMoney(null)}
            className="text-xs text-[#c59b27] underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {hasFoundMoney === true && (
        <form onSubmit={handleSubmit} className="space-y-4 my-3 animate-fade-in">
          <p className="text-xs text-[#e8e2d5] font-serif">
            Très bien. Complétez le nom de cette monnaie :
          </p>

          <div className="bg-[#181615] p-3 rounded-lg border border-[#8f7223]/50 flex items-center gap-2">
            <span className="font-serif font-bold text-[#c59b27] text-sm">1 sous =</span>
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError(false);
              }}
              placeholder="ex: Trèfle"
              className="flex-1 bg-transparent text-[#e8e2d5] font-bold text-base focus:outline-none placeholder-[#635c52]"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold bg-red-950/60 p-2.5 rounded border border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>C'est pas ça ! Réfléchissez au symbole des cartes.</span>
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
            <span>IDENTIFIER LA MONNAIE</span>
          </button>
        </form>
      )}
    </div>
  );
};
