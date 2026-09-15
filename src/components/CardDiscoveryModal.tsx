import React from 'react';
import { CardValidationResult } from '../engine/gameEngine';
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CardDiscoveryModalProps {
  result: CardValidationResult | null;
  onClose: () => void;
}

const SUIT_SYMBOLS: Record<string, { symbol: string; color: string; label: string }> = {
  diamond: { symbol: '♦', color: 'text-red-600', label: 'Carreau' },
  heart: { symbol: '♥', color: 'text-red-600', label: 'Cœur' },
  spade: { symbol: '♠', color: 'text-slate-800', label: 'Pique' },
  club: { symbol: '♣', color: 'text-emerald-700', label: 'Trèfle' },
};

export const CardDiscoveryModal: React.FC<CardDiscoveryModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm">
        {/* --- EARLY DISCOVERY CASE (Requirement #11) --- */}
        {result.type === 'early_discovery' && (
          <div className="paper-doc p-6 text-center shadow-2xl border-2 border-amber-600/40 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif text-amber-900 mb-2 uppercase tracking-wide">
              PREUVE ENREGISTRÉE
            </h3>
            <div className="my-4 py-3 bg-amber-50 rounded border border-amber-200">
              <span className={`text-4xl ${SUIT_SYMBOLS[result.card.suit].color}`}>
                {SUIT_SYMBOLS[result.card.suit].symbol} {result.card.rank}
              </span>
            </div>
            <p className="text-sm text-gray-800 mb-4 leading-relaxed font-serif italic">
              « Cette carte semble importante... Mais vous ne pouvez pas encore comprendre ce qu'elle signifie. »
            </p>
            <p className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-6">
              Continuez votre enquête.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#1c1a18] text-[#e8e2d5] font-serif font-bold rounded-lg hover:bg-black transition-colors"
            >
              COMPRIS
            </button>
          </div>
        )}

        {/* --- MAIN CARD DISCOVERY CASE --- */}
        {result.type === 'main_success' && (
          <div className="paper-doc p-6 text-center shadow-2xl border-2 border-[#c59b27] animate-fade-in">
            <div className="flex items-center justify-center gap-1 text-[#c59b27] text-xs font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>CARTE IDENTIFIÉE</span>
              <Sparkles className="w-4 h-4" />
            </div>

            {/* Visual Playing Card mockup */}
            <div className="my-4 mx-auto w-32 h-44 bg-amber-50 border-2 border-gray-400 rounded-lg flex flex-col justify-between p-3 shadow-md relative">
              <div className="text-left font-bold text-lg leading-none">
                <span className={SUIT_SYMBOLS[result.card.suit].color}>
                  {result.card.rank}<br />{SUIT_SYMBOLS[result.card.suit].symbol}
                </span>
              </div>
              <div className={`text-5xl text-center ${SUIT_SYMBOLS[result.card.suit].color}`}>
                {SUIT_SYMBOLS[result.card.suit].symbol}
              </div>
              <div className="text-right font-bold text-lg leading-none rotate-180">
                <span className={SUIT_SYMBOLS[result.card.suit].color}>
                  {result.card.rank}<br />{SUIT_SYMBOLS[result.card.suit].symbol}
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold font-serif text-gray-900 mb-1">
              {result.card.title}
            </h2>
            {result.card.subtitle && (
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-4">
                {result.card.subtitle}
              </p>
            )}

            <p className="text-sm text-gray-700 leading-relaxed font-serif mb-6 text-left bg-stone-100 p-3 rounded border border-stone-200">
              {result.card.description}
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#9e2a2b] hover:bg-[#b83234] text-white font-serif font-bold rounded-lg shadow-lg transition-all"
            >
              CONTINUER L'ENQUÊTE
            </button>
          </div>
        )}

        {/* --- CURRENCY TRÈFLE DISCOVERY CASE --- */}
        {result.type === 'currency_success' && (
          <div className="paper-doc p-6 text-center shadow-2xl border-2 border-emerald-600 animate-fade-in">
            <div className="text-emerald-700 text-5xl mb-2 font-bold">♣</div>
            <h3 className="text-xl font-bold font-serif text-gray-900 mb-1">
              {result.card.title}
            </h3>
            <div className="my-3 py-2 bg-emerald-50 text-emerald-900 font-bold text-sm rounded border border-emerald-200">
              +{result.value} sous ajoutés au portefeuille
            </div>
            <p className="text-xs text-gray-600 mb-6">
              {result.card.description}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-serif font-bold rounded-lg shadow-lg transition-colors"
            >
              RANGERCETTE CARTE
            </button>
          </div>
        )}

        {/* --- RED HERRING DISCOVERY CASE --- */}
        {result.type === 'red_herring_success' && (
          <div className="paper-doc p-6 text-center shadow-2xl border-2 border-slate-600 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-gray-900 mb-1">
              {result.card.title}
            </h3>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
              {result.card.subtitle}
            </p>
            <p className="text-sm text-gray-700 font-serif leading-relaxed mb-6 text-left bg-slate-50 p-3 rounded border border-slate-200">
              {result.card.description}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#1c1a18] text-white font-serif font-bold rounded-lg hover:bg-black transition-colors"
            >
              NOTER DANS LE DOSSIER
            </button>
          </div>
        )}

        {/* --- ALREADY FOUND CASE --- */}
        {result.type === 'already_found' && (
          <div className="bg-[#24211e] border border-[#8f7223]/50 text-[#e8e2d5] p-5 text-center rounded-xl shadow-2xl animate-fade-in">
            <CheckCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold font-serif mb-2">
              CARTE DÉJÀ ENREGISTRÉE
            </h3>
            <p className="text-sm text-[#8c8376] mb-5">
              Cette carte ({result.card.title}) a déjà été saisie et enregistrée dans votre inventaire.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#3a3530] text-[#e8e2d5] font-semibold rounded-lg hover:bg-[#48423c] transition-colors"
            >
              FERMER
            </button>
          </div>
        )}

        {/* --- UNKNOWN CARD CASE --- */}
        {result.type === 'unknown' && (
          <div className="bg-[#24211e] border border-[#3a3530] text-[#e8e2d5] p-5 text-center rounded-xl shadow-2xl animate-fade-in">
            <HelpCircle className="w-10 h-10 text-[#8c8376] mx-auto mb-2" />
            <h3 className="text-lg font-bold font-serif mb-2">
              CARTE SANS IMPORTANCE
            </h3>
            <p className="text-sm text-[#8c8376] mb-5">
              Cette carte ne semble contenir aucun indice particulier pour l'enquête. Continuez vos recherches !
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#3a3530] text-[#e8e2d5] font-semibold rounded-lg hover:bg-[#48423c] transition-colors"
            >
              RETOURNER À L'ENQUÊTE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
