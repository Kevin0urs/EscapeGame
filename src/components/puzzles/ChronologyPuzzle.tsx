import React, { useState } from 'react';
import { CHRONOLOGY_ITEMS } from '../../data/story';
import { ArrowUp, ArrowDown, Check, History, AlertCircle } from 'lucide-react';

interface ChronologyPuzzleProps {
  initialOrder: string[];
  onSolve: (order: string[]) => { success: boolean };
}

export const ChronologyPuzzle: React.FC<ChronologyPuzzleProps> = ({ initialOrder, onSolve }) => {
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [error, setError] = useState(false);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...order];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);
    setError(false);
  };

  const moveDown = (index: number) => {
    if (index === order.length - 1) return;
    const newOrder = [...order];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);
    setError(false);
  };

  const handleValidate = () => {
    const res = onSolve(order);
    if (!res.success) {
      setError(true);
    }
  };

  return (
    <div className="bg-[#24211e] border-2 border-[#c59b27]/60 rounded-xl p-5 shadow-xl my-4 text-[#e8e2d5] animate-fade-in">
      <div className="flex items-center gap-2 mb-2 text-[#c59b27]">
        <History className="w-5 h-5" />
        <h3 className="text-base font-bold font-serif uppercase tracking-wider">
          RECONSTITUEZ L'HISTOIRE
        </h3>
      </div>

      <p className="text-xs text-[#8c8376] mb-4">
        Utilisez les flèches haut/bas pour remettre les événements dans le bon ordre chronologique du premier au dernier.
      </p>

      {/* Item List (Letters A, B, C hidden as requested!) */}
      <div className="space-y-2 mb-5">
        {order.map((itemId, index) => {
          const item = CHRONOLOGY_ITEMS.find((it) => it.id === itemId);
          if (!item) return null;

          return (
            <div
              key={itemId}
              className="flex items-center justify-between gap-3 p-3 bg-[#181615] border border-[#3a3530] rounded-lg transition-all"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-xs font-bold text-[#c59b27] font-serif shrink-0 mt-0.5">
                  {index + 1}.
                </span>
                <p className="text-xs text-[#e8e2d5] leading-snug">
                  {item.text}
                </p>
              </div>

              {/* Up / Down Action Controls */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                  className={`p-1.5 rounded border transition-colors ${
                    index === 0
                      ? 'border-[#2d2824] text-[#423d38] cursor-not-allowed'
                      : 'border-[#8f7223]/50 text-[#c59b27] bg-[#221f1c] hover:bg-[#2d2824]'
                  }`}
                  aria-label="Monter"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={index === order.length - 1}
                  onClick={() => moveDown(index)}
                  className={`p-1.5 rounded border transition-colors ${
                    index === order.length - 1
                      ? 'border-[#2d2824] text-[#423d38] cursor-not-allowed'
                      : 'border-[#8f7223]/50 text-[#c59b27] bg-[#221f1c] hover:bg-[#2d2824]'
                  }`}
                  aria-label="Descendre"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold bg-red-950/60 p-2.5 rounded border border-red-800 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>La séquence n'est pas correcte. Relisez attentivement les mobiles et les témoignages.</span>
        </div>
      )}

      <button
        onClick={handleValidate}
        className="w-full py-3.5 bg-[#9e2a2b] hover:bg-[#b83234] text-white font-serif font-bold text-sm rounded-lg shadow-lg shadow-[#9e2a2b]/30 flex items-center justify-center gap-2 transition-all active:scale-98"
      >
        <Check className="w-5 h-5" />
        <span>VALIDER LA CHRONOLOGIE</span>
      </button>
    </div>
  );
};
