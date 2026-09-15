import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';

interface HomeScreenProps {
  hasSavedGame: boolean;
  onStartNew: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  hasSavedGame,
  onStartNew,
  onResume,
  onReset,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="min-h-screen bg-[#181615] flex flex-col justify-between p-6 relative overflow-hidden text-[#e8e2d5]">
      {/* Background card suit watermark silhouettes */}
      <div className="absolute -top-10 -right-10 text-[#24211e] text-[160px] font-serif select-none pointer-events-none opacity-40">
        ♦
      </div>
      <div className="absolute -bottom-10 -left-10 text-[#24211e] text-[160px] font-serif select-none pointer-events-none opacity-40">
        ♠
      </div>

      {/* Top spacer */}
      <div></div>

      {/* Main Title Banner */}
      <div className="text-center z-10 my-auto">
        <div className="inline-block px-4 py-1 bg-[#24211e] border border-[#c59b27]/40 rounded-full text-xs font-serif font-bold text-[#c59b27] uppercase tracking-widest mb-6 shadow-md">
          ESCAPE GAME & MURDER MYSTERY
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-widest text-[#e8e2d5] mb-2 leading-tight drop-shadow-md">
          LE DERNIER SERVICE
        </h1>

        <div className="w-16 h-0.5 bg-[#8f7223] mx-auto my-4"></div>

        <h3 className="text-base sm:text-lg font-serif italic text-[#c59b27] tracking-wide mb-8">
          Une enquête de Béatrice de Carreau
        </h3>

        {/* Action Buttons */}
        <div className="max-w-xs mx-auto space-y-4">
          {hasSavedGame ? (
            <>
              <button
                onClick={onResume}
                className="w-full py-4 bg-[#9e2a2b] hover:bg-[#b83234] text-white font-serif font-bold tracking-wider rounded-xl shadow-xl shadow-[#9e2a2b]/30 flex items-center justify-center gap-3 transition-all active:scale-98"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>REPRENDRE L'ENQUÊTE</span>
              </button>

              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-3 bg-[#24211e] hover:bg-[#2d2824] border border-[#3a3530] text-[#8c8376] hover:text-[#e8e2d5] font-serif font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>COMMENCER UNE NOUVELLE ENQUÊTE</span>
              </button>
            </>
          ) : (
            <button
              onClick={onStartNew}
              className="w-full py-4 bg-[#9e2a2b] hover:bg-[#b83234] text-white font-serif font-bold tracking-wider rounded-xl shadow-xl shadow-[#9e2a2b]/30 flex items-center justify-center gap-3 transition-all active:scale-98"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>COMMENCER L'ENQUÊTE</span>
            </button>
          )}
        </div>
      </div>

      {/* Discrete Reset Option (Requirement #6) */}
      <div className="z-10 text-center pb-4">
        {showConfirmReset ? (
          <div className="bg-[#24211e] border border-red-700/60 p-4 rounded-xl max-w-xs mx-auto animate-fade-in shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-bold mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Réinitialiser la partie ?</span>
            </div>
            <p className="text-[11px] text-[#8c8376] mb-3">
              Toute la progression actuelle sera définitivement effacée.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 bg-[#2d2824] text-xs font-semibold rounded text-[#e8e2d5]"
              >
                ANNULER
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  onReset();
                }}
                className="flex-1 py-2 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded"
              >
                RECOMMENCER
              </button>
            </div>
          </div>
        ) : (
          hasSavedGame && (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-[11px] text-[#635c52] hover:text-[#8c8376] underline underline-offset-4 font-mono transition-colors"
            >
              Réinitialiser la partie
            </button>
          )
        )}
      </div>
    </div>
  );
};
