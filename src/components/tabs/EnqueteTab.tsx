import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { STAGE_GOALS } from '../../data/story';
import { getCloverBalance } from '../../engine/gameEngine';
import { CurrencyPuzzle } from '../puzzles/CurrencyPuzzle';
import { FoldPuzzle } from '../puzzles/FoldPuzzle';
import { ChronologyPuzzle } from '../puzzles/ChronologyPuzzle';
import { AccusationPuzzle } from '../puzzles/AccusationPuzzle';
import { PlusCircle, Lightbulb, Mask, Lock, History } from 'lucide-react';

interface EnqueteTabProps {
  state: GameState;
  onOpenCardModal: () => void;
  onSolveCurrency: (answer: string) => { success: boolean };
  onPayFirmin: () => { success: boolean };
  onSolveFold: (answer: string) => { success: boolean };
  onSolveChronology: (order: string[]) => { success: boolean };
  onAccuse: (suspect: string) => { success: boolean };
  onOpenRoleplay: () => void;
}

export const EnqueteTab: React.FC<EnqueteTabProps> = ({
  state,
  onOpenCardModal,
  onSolveCurrency,
  onPayFirmin,
  onSolveFold,
  onSolveChronology,
  onAccuse,
  onOpenRoleplay,
}) => {
  const [showHintModal, setShowHintModal] = useState(false);
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [payError, setPayError] = useState(false);

  const goal = STAGE_GOALS[state.currentStage];
  const { balance } = getCloverBalance(state);

  const handlePayFirmin = () => {
    const res = onPayFirmin();
    if (!res.success) {
      setPayError(true);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto animate-fade-in">
      {/* --- CHARACTER SPEECH BANNER (Requirement / Comment #4) --- */}
      {state.pendingSpeech && (
        <div className="bg-[#9e2a2b] border-2 border-[#c59b27] rounded-xl p-4 shadow-xl text-center text-white animate-pulse-gold">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Mask className="w-6 h-6 text-[#c59b27]" />
            <h3 className="text-base font-bold font-serif uppercase tracking-wider text-[#c59b27]">
              MESSAGE IMPORTANT DE PERSONNAGE
            </h3>
          </div>
          <p className="text-sm font-serif font-bold text-amber-100 mb-3">
            Le personnage <span className="underline">{state.pendingSpeech.speaker}</span> veut vous parler !
          </p>
          <p className="text-xs text-amber-200/90 mb-4 font-serif">
            Allez voir le Maître du jeu.
          </p>
          <button
            onClick={onOpenRoleplay}
            className="w-full py-3 bg-[#181615] hover:bg-black text-[#c59b27] font-serif font-bold text-xs rounded-lg border border-[#c59b27] shadow transition-colors"
          >
            PASSER LE TÉLÉPHONE AU MAÎTRE DU JEU (MJ)
          </button>
        </div>
      )}

      {/* --- CURRENT OBJECTIVE BANNER --- */}
      {goal && (
        <div className="bg-[#24211e] border border-[#8f7223]/50 rounded-xl p-4 shadow-lg text-[#e8e2d5]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#c59b27] uppercase tracking-widest font-serif">
              OBJECTIF EN COURS
            </span>
            <button
              onClick={() => {
                setHintLevel(1);
                setShowHintModal(true);
              }}
              className="flex items-center gap-1 text-xs text-[#c59b27] hover:underline font-semibold bg-[#2d2824] px-2.5 py-1 rounded border border-[#8f7223]/30"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>INDICE</span>
            </button>
          </div>

          <h2 className="text-lg font-bold font-serif text-[#e8e2d5] mb-1">
            {goal.title}
          </h2>
          <p className="text-xs text-[#8c8376] leading-relaxed whitespace-pre-line font-serif">
            {goal.description}
          </p>
        </div>
      )}

      {/* --- MAIN ACTION : ADD CARD BUTTON --- */}
      <button
        onClick={onOpenCardModal}
        className="w-full py-4 bg-[#9e2a2b] hover:bg-[#b83234] text-white font-serif font-bold tracking-wider rounded-xl shadow-xl shadow-[#9e2a2b]/30 flex items-center justify-center gap-3 transition-all active:scale-98"
      >
        <PlusCircle className="w-6 h-6" />
        <span className="text-base">AJOUTER UNE CARTE</span>
      </button>

      {/* --- INTERACTIVE STAGE PUZZLES --- */}
      {/* Stage 2: Currency Puzzle ("1 sous = ____") */}
      {state.currentStage === 2 && !state.currencyIdentified && (
        <CurrencyPuzzle onSolve={onSolveCurrency} />
      )}

      {/* Stage 3: Firmin Payment (5♣) */}
      {state.currentStage === 3 && (
        <div className="bg-[#24211e] border-2 border-[#c59b27]/60 rounded-xl p-5 shadow-xl text-[#e8e2d5]">
          <h3 className="text-base font-bold font-serif text-[#c59b27] uppercase tracking-wider mb-2">
            INTERROGER FIRMIN
          </h3>
          <p className="text-xs text-[#8c8376] mb-4">
            Firmin ne parlera davantage que si vous lui donnez son dû.<br />
            <strong className="text-amber-200">Coût : 5 trèfles (5♣)</strong>
          </p>

          <div className="bg-[#181615] p-3 rounded-lg border border-[#3a3530] mb-4 flex justify-between items-center text-xs">
            <span className="text-[#8c8376]">Votre solde de trèfles :</span>
            <span className="font-bold text-emerald-400 text-sm">♣ {balance}</span>
          </div>

          {payError && (
            <p className="text-xs text-red-400 font-semibold mb-3">
              Vous n'avez pas assez de trèfles (5♣ requis). Continuez à chercher dans la maison !
            </p>
          )}

          <button
            disabled={balance < 5}
            onClick={handlePayFirmin}
            className={`w-full py-3.5 rounded-lg font-serif font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              balance >= 5
                ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-lg cursor-pointer'
                : 'bg-[#2b2724] text-[#635c52] border border-[#38332e] cursor-not-allowed'
            }`}
          >
            {balance >= 5 ? <span>PAYER 5♣</span> : <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> TRÈFLES INSUFFISANTS</span>}
          </button>
        </div>
      )}

      {/* Stage 7: Folded Card Puzzle */}
      {state.currentStage === 7 && (
        <FoldPuzzle onSolve={onSolveFold} />
      )}

      {/* Stage 10: Chronology Puzzle */}
      {state.currentStage === 10 && (
        <ChronologyPuzzle
          initialOrder={state.chronologyOrder}
          onSolve={onSolveChronology}
        />
      )}

      {/* Stage 11: Accusation Puzzle */}
      {state.currentStage === 11 && (
        <AccusationPuzzle onAccuse={onAccuse} />
      )}

      {/* --- STORY TIMELINE / LOGS FEED --- */}
      <div className="mt-6 space-y-3">
        <h3 className="text-xs font-bold text-[#c59b27] uppercase tracking-widest font-serif flex items-center gap-1.5 border-b border-[#3a3530] pb-2">
          <History className="w-4 h-4" />
          <span>JOURNAL DE L'ENQUÊTE</span>
        </h3>

        {state.storyLogs.map((log) => (
          <div
            key={log.id}
            className={`p-4 rounded-xl border text-sm transition-all ${
              log.type === 'milestone'
                ? 'bg-[#24211e] border-[#8f7223]/40 text-[#e8e2d5]'
                : log.type === 'testimony'
                ? 'paper-doc border-[#c59b27] text-gray-900 shadow-md'
                : 'bg-[#1c1a18] border-[#3a3530] text-[#c59b27]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif font-bold text-xs uppercase tracking-wider">
                {log.title}
              </span>
              {log.speaker && (
                <span className="text-[10px] px-2 py-0.5 bg-amber-950 text-amber-300 font-serif font-bold rounded">
                  {log.speaker}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed whitespace-pre-line font-serif">
              {log.text}
            </p>
          </div>
        ))}
      </div>

      {/* --- HINT MODAL --- */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#1c1a18] border border-[#8f7223] rounded-xl p-5 shadow-2xl text-[#e8e2d5]">
            <div className="flex items-center justify-between border-b border-[#3a3530] pb-3 mb-3">
              <div className="flex items-center gap-2 text-[#c59b27]">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold font-serif uppercase">INDICES D'ENQUÊTE</h3>
              </div>
              <button onClick={() => setShowHintModal(false)} className="text-[#8c8376] hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-[#8c8376] mb-4">
              Consultez un indice progressif pour avancer :
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-[#24211e] border border-[#3a3530] rounded-lg">
                <span className="text-[10px] font-bold text-[#c59b27] uppercase block mb-1">INDICE 1</span>
                <p className="text-xs font-serif text-[#e8e2d5]">{goal?.hintLevel1}</p>
              </div>

              {hintLevel >= 2 ? (
                <div className="p-3 bg-[#24211e] border border-[#8f7223]/50 rounded-lg animate-fade-in">
                  <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">INDICE 2</span>
                  <p className="text-xs font-serif text-[#e8e2d5]">{goal?.hintLevel2}</p>
                </div>
              ) : (
                <button
                  onClick={() => setHintLevel(2)}
                  className="w-full py-2 bg-[#2d2824] hover:bg-[#3d3732] text-xs text-[#c59b27] font-semibold rounded border border-[#3a3530]"
                >
                  RÉVÉLER L'INDICE 2
                </button>
              )}

              {hintLevel >= 3 ? (
                <div className="p-3 bg-amber-950/60 border border-amber-600 rounded-lg animate-fade-in">
                  <span className="text-[10px] font-bold text-red-400 uppercase block mb-1">SOLUTION</span>
                  <p className="text-xs font-serif text-amber-200">{goal?.solution}</p>
                </div>
              ) : hintLevel >= 2 ? (
                <button
                  onClick={() => setHintLevel(3)}
                  className="w-full py-2 bg-red-950 hover:bg-red-900 text-xs text-red-300 font-semibold rounded border border-red-800"
                >
                  RÉVÉLER LA SOLUTION
                </button>
              ) : null}
            </div>

            <button
              onClick={() => setShowHintModal(false)}
              className="w-full py-2.5 bg-[#2d2824] text-[#e8e2d5] font-serif font-bold text-xs rounded-lg"
            >
              FERMER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
