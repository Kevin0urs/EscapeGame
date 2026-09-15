import React, { useState } from 'react';
import { GameState, GameStage } from '../types/game';
import { STAGE_GOALS } from '../data/story';
import { getCloverBalance } from '../engine/gameEngine';
import { Shield, FastForward, PlusCircle, RefreshCw, X, Play, Mask } from 'lucide-react';

interface MasterModeModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
  onJumpStage: (stage: GameStage) => void;
  onAddClovers: (amount: number) => void;
  onAdvanceStage: () => void;
  onResetGame: () => void;
  onOpenRoleplay: () => void;
}

export const MasterModeModal: React.FC<MasterModeModalProps> = ({
  isOpen,
  state,
  onClose,
  onJumpStage,
  onAddClovers,
  onAdvanceStage,
  onResetGame,
  onOpenRoleplay,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  if (!isOpen) return null;

  const currentGoal = STAGE_GOALS[state.currentStage];
  const { balance, totalFound } = getCloverBalance(state);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-[#181615] border-2 border-red-700 rounded-xl p-5 shadow-2xl relative text-[#e8e2d5] my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-700/50 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-bold font-serif text-red-400">
              MODE MAÎTRE DU JEU (MJ)
            </h2>
          </div>
          <button onClick={onClose} className="text-[#8c8376] hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Pending Character Speech Notification */}
        {state.pendingSpeech && (
          <div className="bg-amber-950/80 border-2 border-[#c59b27] rounded-lg p-3 mb-4 text-center animate-pulse">
            <p className="text-xs font-bold text-[#c59b27] uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <Mask className="w-4 h-4" />
              <span>PAROLE EN ATTENTE ({state.pendingSpeech.speaker})</span>
            </p>
            <p className="text-xs text-amber-200 mb-2">
              Les joueurs attendent que vous incarniez ce personnage !
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenRoleplay();
              }}
              className="py-2 px-4 bg-[#9e2a2b] hover:bg-[#b83234] text-white font-serif font-bold text-xs rounded shadow"
            >
              INCARNER {state.pendingSpeech.speaker} MAINTENANT
            </button>
          </div>
        )}

        {/* Game Status Overview */}
        <div className="bg-[#24211e] rounded-lg p-3 border border-[#3a3530] mb-4 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#8c8376]">Étape actuelle :</span>
            <span className="font-bold text-[#c59b27]">Stage {state.currentStage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c8376]">Objectif actif :</span>
            <span className="font-bold text-white truncate max-w-[180px]">{currentGoal?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c8376]">Portefeuille Trèfles :</span>
            <span className="font-bold text-emerald-400">
              {balance}♣ disponibles (Total trouvé : {totalFound}♣, Dépensé : {state.spentClubs}♣)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c8376]">Cartes trouvées :</span>
            <span className="font-bold text-slate-300">
              {state.discoveredCards.length} cartes ({state.earlyCards.length} en avance)
            </span>
          </div>
        </div>

        {/* Emergency MJ Actions */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-[#c59b27] uppercase tracking-wider mb-2">
            Actions d'urgence MJ
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onAdvanceStage}
              className="p-2.5 bg-[#2d2824] hover:bg-[#3d3732] border border-[#8f7223]/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <FastForward className="w-4 h-4 text-amber-400" />
              <span>Étape suivante</span>
            </button>
            <button
              onClick={() => onAddClovers(5)}
              className="p-2.5 bg-[#2d2824] hover:bg-[#3d3732] border border-emerald-700/50 rounded-lg text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>+5 Trèfles</span>
            </button>
          </div>
        </div>

        {/* Jump to Act (Test & Demo Mode) */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-[#c59b27] uppercase tracking-wider mb-2">
            Sauter d'acte (Mode Test / Démo)
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => onJumpStage(0)}
              className="p-2 bg-[#221f1c] hover:bg-[#2d2824] border border-[#3a3530] rounded text-left flex items-center gap-1"
            >
              <Play className="w-3 h-3 text-red-400" />
              <span>Acte 1 : J♦ Firmin</span>
            </button>
            <button
              onClick={() => onJumpStage(2)}
              className="p-2 bg-[#221f1c] hover:bg-[#2d2824] border border-[#3a3530] rounded text-left flex items-center gap-1"
            >
              <Play className="w-3 h-3 text-red-400" />
              <span>Acte 2 : K♦ & Monnaie</span>
            </button>
            <button
              onClick={() => onJumpStage(4)}
              className="p-2 bg-[#221f1c] hover:bg-[#2d2824] border border-[#3a3530] rounded text-left flex items-center gap-1"
            >
              <Play className="w-3 h-3 text-red-400" />
              <span>Acte 3 : Q♦ & 8♥</span>
            </button>
            <button
              onClick={() => onJumpStage(8)}
              className="p-2 bg-[#221f1c] hover:bg-[#2d2824] border border-[#3a3530] rounded text-left flex items-center gap-1"
            >
              <Play className="w-3 h-3 text-red-400" />
              <span>Acte 4 : 10♦ & A♠</span>
            </button>
            <button
              onClick={() => onJumpStage(10)}
              className="p-2 bg-[#221f1c] hover:bg-[#2d2824] border border-[#3a3530] rounded text-left flex items-center gap-1 col-span-2"
            >
              <Play className="w-3 h-3 text-amber-400" />
              <span>Acte 5 : Chronologie & Accusation</span>
            </button>
          </div>
        </div>

        {/* Reset Game Section */}
        <div className="border-t border-[#3a3530] pt-4">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-2.5 bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-300 font-serif font-bold text-xs rounded-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RÉINITIALISER L'ENQUÊTE</span>
            </button>
          ) : (
            <div className="bg-red-950 p-3 rounded-lg border border-red-600 text-center">
              <p className="text-xs text-red-200 font-bold mb-2">
                Effacer définitivement toute la progression ?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-1.5 bg-[#2b2724] text-xs font-semibold rounded"
                >
                  ANNULER
                </button>
                <button
                  onClick={() => {
                    setConfirmReset(false);
                    onResetGame();
                  }}
                  className="flex-1 py-1.5 bg-red-600 text-white font-bold text-xs rounded"
                >
                  EFFACER TOUT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
