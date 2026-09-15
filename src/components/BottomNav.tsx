import React from 'react';
import { GameState } from '../types/game';
import { Search, Briefcase, Clover, BookOpen } from 'lucide-react';

interface BottomNavProps {
  state: GameState;
  activeTab: 'enquete' | 'inventaire' | 'trefles' | 'dossier';
  onChangeTab: (tab: 'enquete' | 'inventaire' | 'trefles' | 'dossier') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ state, activeTab, onChangeTab }) => {
  const showTrefles = state.currencyIdentified;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#181615] border-t border-[#8f7223]/30 px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Tab 1: ENQUÊTE */}
        <button
          onClick={() => onChangeTab('enquete')}
          className={`flex-1 flex flex-col items-center py-1 rounded-lg transition-colors ${
            activeTab === 'enquete'
              ? 'text-[#c59b27] bg-[#24211e] font-bold border border-[#c59b27]/30'
              : 'text-[#8c8376] hover:text-[#e8e2d5]'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase font-medium">ENQUÊTE</span>
        </button>

        {/* Tab 2: INVENTAIRE */}
        <button
          onClick={() => onChangeTab('inventaire')}
          className={`flex-1 flex flex-col items-center py-1 rounded-lg transition-colors ${
            activeTab === 'inventaire'
              ? 'text-[#c59b27] bg-[#24211e] font-bold border border-[#c59b27]/30'
              : 'text-[#8c8376] hover:text-[#e8e2d5]'
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase font-medium">INVENTAIRE</span>
        </button>

        {/* Tab 3: TRÈFLES (Only visible when unlocked!) */}
        {showTrefles && (
          <button
            onClick={() => onChangeTab('trefles')}
            className={`flex-1 flex flex-col items-center py-1 rounded-lg transition-colors animate-fade-in ${
              activeTab === 'trefles'
                ? 'text-[#c59b27] bg-[#24211e] font-bold border border-[#c59b27]/30'
                : 'text-[#8c8376] hover:text-[#e8e2d5]'
            }`}
          >
            <Clover className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-wider uppercase font-medium">TRÈFLES</span>
          </button>
        )}

        {/* Tab 4: DOSSIER */}
        <button
          onClick={() => onChangeTab('dossier')}
          className={`flex-1 flex flex-col items-center py-1 rounded-lg transition-colors ${
            activeTab === 'dossier'
              ? 'text-[#c59b27] bg-[#24211e] font-bold border border-[#c59b27]/30'
              : 'text-[#8c8376] hover:text-[#e8e2d5]'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase font-medium">DOSSIER</span>
        </button>
      </div>
    </nav>
  );
};
