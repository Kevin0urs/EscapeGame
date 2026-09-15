import React from 'react';
import { GameState } from '../../types/game';
import { CARDS_DB } from '../../data/cards';
import { getCloverBalance } from '../../engine/gameEngine';
import { Clover, Check, Lock, ShoppingBag } from 'lucide-react';

interface TreflesTabProps {
  state: GameState;
}

const CLOVER_CARDS = ['2_club', '3_club', '4_club', '5_club', '6_club'];

export const TreflesTab: React.FC<TreflesTabProps> = ({ state }) => {
  const { balance, totalFound } = getCloverBalance(state);

  return (
    <div className="space-y-6 pb-20 max-w-lg mx-auto animate-fade-in text-[#e8e2d5]">
      {/* Wallet Card Header */}
      <div className="bg-[#24211e] border-2 border-emerald-600/70 rounded-xl p-6 shadow-xl text-center relative overflow-hidden">
        <div className="absolute -top-6 -right-6 text-emerald-950/40 text-[120px] font-bold select-none pointer-events-none">
          ♣
        </div>

        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-serif block mb-1">
          PORTEFEUILLE DE TRÈFLES
        </span>

        <div className="text-4xl font-black font-serif text-emerald-400 my-2 flex items-center justify-center gap-1">
          <span>♣</span>
          <span>{balance}</span>
        </div>

        <p className="text-xs text-[#8c8376]">
          Solde disponible à dépenser
        </p>

        <div className="mt-4 pt-4 border-t border-[#3a3530] grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[#8c8376] block">Total trouvé :</span>
            <span className="font-bold text-emerald-300">+{totalFound} sous</span>
          </div>
          <div>
            <span className="text-[#8c8376] block">Total dépensé :</span>
            <span className="font-bold text-amber-400">-{state.spentClubs} sous</span>
          </div>
        </div>
      </div>

      {/* Clover Cards Breakdown */}
      <div>
        <h3 className="text-xs font-bold font-serif text-[#c59b27] uppercase tracking-widest mb-3">
          DÉTAIL DES CARTES DE MONNAIE
        </h3>

        <div className="space-y-2.5">
          {CLOVER_CARDS.map((cardId) => {
            const card = CARDS_DB[cardId];
            const isFound = state.foundClubs.includes(cardId);
            if (!card) return null;

            return (
              <div
                key={cardId}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isFound
                    ? 'bg-[#24211e] border-emerald-700/50 text-[#e8e2d5]'
                    : 'bg-[#181615] border-[#2b2724] opacity-50 text-[#635c52]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                      isFound ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-[#221f1c] text-[#48423c]'
                    }`}
                  >
                    ♣ {card.rank}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-serif">
                      {isFound ? card.title : `${card.rank} de Trèfle`}
                    </h4>
                    <span className="text-xs text-[#8c8376]">
                      Valeur : +{card.value} sous
                    </span>
                  </div>
                </div>

                {isFound ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                    <span>Trouvée</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#635c52] bg-[#1c1a18] px-2.5 py-1 rounded border border-[#2d2824]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>À trouver</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Spent History if any */}
      {state.spentClubs > 0 && (
        <div className="bg-[#1c1a18] p-4 rounded-xl border border-[#3a3530]">
          <h4 className="text-xs font-bold text-[#c59b27] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-serif">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>HISTORIQUE DES DÉPENSES</span>
          </h4>
          <div className="text-xs text-[#8c8376] flex justify-between items-center">
            <span>Interrogatoire de Firmin (Témoignage)</span>
            <span className="font-bold text-amber-400">-5 ♣</span>
          </div>
        </div>
      )}
    </div>
  );
};
