import React, { useState } from 'react';
import { GameState, Card } from '../../types/game';
import { CARDS_DB } from '../../data/cards';
import { Lock, Eye } from 'lucide-react';

interface InventaireTabProps {
  state: GameState;
}

const CATEGORIES = [
  {
    title: 'Personnages',
    cardIds: ['J_diamond', 'K_diamond', 'Q_diamond']
  },
  {
    title: 'Preuves',
    cardIds: ['A_heart', '8_heart', '10_diamond', 'A_spade']
  },
  {
    title: 'Fausses pistes',
    cardIds: ['7_spade', 'J_heart']
  }
];

const SUIT_SYMBOLS: Record<string, { symbol: string; color: string }> = {
  diamond: { symbol: '♦', color: 'text-red-600' },
  heart: { symbol: '♥', color: 'text-red-600' },
  spade: { symbol: '♠', color: 'text-slate-300' },
  club: { symbol: '♣', color: 'text-emerald-400' },
};

export const InventaireTab: React.FC<InventaireTabProps> = ({ state }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  return (
    <div className="space-y-6 pb-20 max-w-lg mx-auto animate-fade-in text-[#e8e2d5]">
      <div className="border-b border-[#3a3530] pb-2">
        <h2 className="text-lg font-bold font-serif text-[#c59b27] uppercase tracking-wider">
          INVENTAIRE DES CARTES
        </h2>
        <p className="text-xs text-[#8c8376]">
          Inspectez les éléments et preuves découverts durant l'enquête.
        </p>
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat.title} className="space-y-3">
          <h3 className="text-xs font-bold font-serif text-[#c59b27] uppercase tracking-widest">
            {cat.title}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {cat.cardIds.map((cardId) => {
              const card = CARDS_DB[cardId];
              const isUnlocked = state.discoveredCards.includes(cardId);

              if (!card) return null;

              return (
                <div
                  key={cardId}
                  onClick={() => isUnlocked && setSelectedCard(card)}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-[#24211e] border-[#8f7223]/50 hover:border-[#c59b27] cursor-pointer shadow-md'
                      : 'bg-[#181615] border-[#2b2724] opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {isUnlocked ? (
                      <span className={`text-xl font-bold ${SUIT_SYMBOLS[card.suit].color}`}>
                        {card.rank} {SUIT_SYMBOLS[card.suit].symbol}
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-[#635c52]">
                        ? {SUIT_SYMBOLS[card.suit].symbol}
                      </span>
                    )}

                    {isUnlocked ? (
                      <Eye className="w-4 h-4 text-[#c59b27]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#635c52]" />
                    )}
                  </div>

                  {isUnlocked ? (
                    <div>
                      <p className="text-xs font-serif font-bold text-[#e8e2d5] line-clamp-1">
                        {card.title}
                      </p>
                      {card.subtitle && (
                        <p className="text-[10px] text-[#8c8376] line-clamp-1 mt-0.5">
                          {card.subtitle}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-serif font-bold text-[#635c52]">
                        ????
                      </p>
                      <p className="text-[10px] text-[#48423c] mt-0.5">
                        Non découverte
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Detail Modal for Unlocked Cards */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="paper-doc p-6 rounded-xl max-w-sm w-full text-center shadow-2xl relative border-2 border-[#c59b27]">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-lg font-bold p-1"
            >
              ✕
            </button>

            <div className="text-4xl mb-2">
              <span className={SUIT_SYMBOLS[selectedCard.suit].color}>
                {selectedCard.rank} {SUIT_SYMBOLS[selectedCard.suit].symbol}
              </span>
            </div>

            <h3 className="text-lg font-bold font-serif text-gray-900 mb-1">
              {selectedCard.title}
            </h3>
            {selectedCard.subtitle && (
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-4">
                {selectedCard.subtitle}
              </p>
            )}

            <p className="text-sm text-gray-700 leading-relaxed font-serif text-left bg-stone-100 p-3 rounded border border-stone-200 mb-5">
              {selectedCard.description}
            </p>

            <button
              onClick={() => setSelectedCard(null)}
              className="w-full py-2.5 bg-[#1c1a18] text-white font-serif font-bold text-xs rounded-lg"
            >
              FERMER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
