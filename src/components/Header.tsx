import React, { useState } from 'react';
import { GameState } from '../types/game';
import { CHAPTERS } from '../data/story';
import { getCloverBalance } from '../engine/gameEngine';
import { ShieldAlert } from 'lucide-react';

interface HeaderProps {
  state: GameState;
  onOpenMasterMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onOpenMasterMode }) => {
  const [tapCount, setTapCount] = useState(0);
  const chapter = CHAPTERS[state.currentStage] || { number: 1, title: 'Le valet' };
  const { balance } = getCloverBalance(state);

  const handleTitleTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    if (nextCount >= 5) {
      setTapCount(0);
      onOpenMasterMode();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#181615]/95 backdrop-blur border-b border-[#8f7223]/30 px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Title with secret MJ 5-tap trigger */}
        <div onClick={handleTitleTap} className="cursor-pointer select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-red-700 text-lg">♦</span>
            <h1 className="text-base font-bold tracking-wider text-[#e8e2d5]">
              LE DERNIER SERVICE
            </h1>
          </div>
          <p className="text-[10px] text-[#8c8376] tracking-wide uppercase font-serif">
            Chapitre {chapter.number} : {chapter.title}
          </p>
        </div>

        {/* Right side: Wallet Pill (Only visible once currency is identified!) */}
        <div className="flex items-center gap-2">
          {state.currencyIdentified && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#24211e] border border-[#c59b27]/40 rounded-full text-xs font-bold text-[#c59b27] animate-fade-in shadow-inner">
              <span className="text-sm">♣</span>
              <span>{balance}</span>
            </div>
          )}

          {/* Master mode indicator button */}
          {state.masterMode && (
            <button
              onClick={onOpenMasterMode}
              className="px-2 py-1 bg-red-950 border border-red-600/50 rounded text-[10px] text-red-300 font-bold flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3 text-red-400" />
              <span>MJ</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
