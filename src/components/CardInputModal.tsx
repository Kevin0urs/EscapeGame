import React, { useState } from 'react';
import { Suit, Rank } from '../types/game';
import { X, Check } from 'lucide-react';

interface CardInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (suit: Suit, rank: Rank) => void;
}

const SUITS: Array<{ suit: Suit; label: string; symbol: string; color: string }> = [
  { suit: 'diamond', label: 'Carreau', symbol: '♦', color: 'text-red-600' },
  { suit: 'heart', label: 'Cœur', symbol: '♥', color: 'text-red-600' },
  { suit: 'spade', label: 'Pique', symbol: '♠', color: 'text-slate-200' },
  { suit: 'club', label: 'Trèfle', symbol: '♣', color: 'text-emerald-400' },
];

const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const CardInputModal: React.FC<CardInputModalProps> = ({ isOpen, onClose, onValidate }) => {
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);

  if (!isOpen) return null;

  const handleValidate = () => {
    if (selectedSuit && selectedRank) {
      onValidate(selectedSuit, selectedRank);
      setSelectedSuit(null);
      setSelectedRank(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#1c1a18] border border-[#8f7223]/50 rounded-xl p-5 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8c8376] hover:text-white p-1"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold font-serif text-[#e8e2d5] text-center mb-4">
          AJOUTER UNE CARTE
        </h2>

        {/* Step 1: Select Suit */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-[#c59b27] uppercase tracking-wider mb-2">
            1. Choisissez la famille
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SUITS.map((item) => (
              <button
                key={item.suit}
                onClick={() => setSelectedSuit(item.suit)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  selectedSuit === item.suit
                    ? 'border-[#c59b27] bg-[#2d2824] shadow-md shadow-[#c59b27]/20 scale-[1.02]'
                    : 'border-[#3a3530] bg-[#221f1c] hover:border-[#8f7223]/40'
                }`}
              >
                <span className={`text-2xl ${item.color}`}>{item.symbol}</span>
                <span className="text-sm font-medium text-[#e8e2d5]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Rank */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#c59b27] uppercase tracking-wider mb-2">
            2. Choisissez la valeur
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {RANKS.map((rank) => (
              <button
                key={rank}
                onClick={() => setSelectedRank(rank)}
                className={`py-2.5 rounded-md border font-bold text-center transition-all text-base ${
                  selectedRank === rank
                    ? 'border-[#c59b27] bg-[#9e2a2b] text-white shadow-md scale-105'
                    : 'border-[#3a3530] bg-[#221f1c] text-[#e8e2d5] hover:border-[#8f7223]/40'
                }`}
              >
                {rank}
              </button>
            ))}
          </div>
        </div>

        {/* Validation Button */}
        <button
          disabled={!selectedSuit || !selectedRank}
          onClick={handleValidate}
          className={`w-full py-3.5 rounded-lg font-serif font-bold tracking-wider text-sm flex items-center justify-center gap-2 transition-all ${
            selectedSuit && selectedRank
              ? 'bg-[#9e2a2b] hover:bg-[#b83234] text-white shadow-lg shadow-[#9e2a2b]/40 cursor-pointer active:scale-98'
              : 'bg-[#2b2724] text-[#635c52] border border-[#38332e] cursor-not-allowed'
          }`}
        >
          <Check className="w-5 h-5" />
          <span>VALIDER LA CARTE</span>
        </button>
      </div>
    </div>
  );
};
