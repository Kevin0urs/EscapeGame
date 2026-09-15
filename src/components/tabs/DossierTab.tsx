import React from 'react';
import { GameState } from '../../types/game';
import { BookOpen, User, ShieldAlert, FileText, CheckCircle2, Lock } from 'lucide-react';

interface DossierTabProps {
  state: GameState;
}

export const DossierTab: React.FC<DossierTabProps> = ({ state }) => {
  const isEmbezzlementUnlocked = state.currentStage >= 3;
  const isFakeMurderUnlocked = state.currentStage >= 5;
  const isArmandPlanUnlocked = state.currentStage >= 9;
  const isRealMurderUnlocked = state.currentStage >= 11;
  const isWeaponUnlocked = state.discoveredCards.includes('A_spade');
  const isHerring7Unlocked = state.discoveredCards.includes('7_spade');
  const isHerringJUnlocked = state.discoveredCards.includes('J_heart');

  return (
    <div className="space-y-5 pb-20 max-w-lg mx-auto animate-fade-in text-[#e8e2d5]">
      <div className="border-b border-[#3a3530] pb-2">
        <h2 className="text-lg font-bold font-serif text-[#c59b27] uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          <span>DOSSIER D'ENQUÊTE</span>
        </h2>
        <p className="text-xs text-[#8c8376]">
          Synthèse progressive des éléments connus sur l'affaire Carreau.
        </p>
      </div>

      {/* --- PERSONNAGES CLES --- */}
      <div className="bg-[#24211e] border border-[#8f7223]/40 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold font-serif text-[#c59b27] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#3a3530] pb-2">
          <User className="w-4 h-4 text-amber-400" />
          <span>PROFILES ET ROLES</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-start">
            <span className="text-[#8c8376]">Victime :</span>
            <span className="font-bold text-[#e8e2d5] text-right">
              {state.currentStage >= 4 ? 'Béatrice de Carreau (Disparue / Décédée)' : 'Inconnue / Béatrice de Carreau'}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-[#8c8376]">Suspect principal :</span>
            <span className="font-bold text-red-400 text-right">
              Armand de Carreau (Mari & Héritier)
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-[#8c8376]">Témoin clé :</span>
            <span className="font-bold text-amber-300 text-right">
              Firmin (Ancien valet)
            </span>
          </div>
        </div>
      </div>

      {/* --- ÉLÉMENTS DE L'AFFAIRE --- */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-serif text-[#c59b27] uppercase tracking-widest flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          <span>FAITS ET HYPOTHÈSES ÉTABLIS</span>
        </h3>

        {/* 1. Vol d'argent */}
        <div className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
          isEmbezzlementUnlocked
            ? 'bg-[#24211e] border-[#8f7223]/50 text-[#e8e2d5]'
            : 'bg-[#181615] border-[#2b2724] opacity-50'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-serif font-bold text-sm text-[#c59b27]">
              1. Détournements d'argent
            </h4>
            {isEmbezzlementUnlocked ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-[#635c52]" />}
          </div>
          {isEmbezzlementUnlocked ? (
            <p>
              Armand volait régulièrement de petites sommes d'argent à sa femme depuis des années, sous forme de cartes de trèfle cachées dans la maison.
            </p>
          ) : (
            <p className="italic text-[#635c52]">???? (En attente de preuves)</p>
          )}
        </div>

        {/* 2. Faux Meurtre */}
        <div className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
          isFakeMurderUnlocked
            ? 'bg-[#24211e] border-[#8f7223]/50 text-[#e8e2d5]'
            : 'bg-[#181615] border-[#2b2724] opacity-50'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-serif font-bold text-sm text-[#c59b27]">
              2. Le piège de Béatrice (Faux meurtre)
            </h4>
            {isFakeMurderUnlocked ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-[#635c52]" />}
          </div>
          {isFakeMurderUnlocked ? (
            <p>
              Béatrice a découvert le vol. Pour confronter son mari et le faire paniquer, elle a mis en scène sa propre disparition et un faux meurtre (faux cœur).
            </p>
          ) : (
            <p className="italic text-[#635c52]">???? (En attente de preuves)</p>
          )}
        </div>

        {/* 3. Reconstitution des Comptes */}
        <div className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
          isArmandPlanUnlocked
            ? 'bg-[#24211e] border-[#8f7223]/50 text-[#e8e2d5]'
            : 'bg-[#181615] border-[#2b2724] opacity-50'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-serif font-bold text-sm text-[#c59b27]">
              3. Découverte du piège par Armand
            </h4>
            {isArmandPlanUnlocked ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-[#635c52]" />}
          </div>
          {isArmandPlanUnlocked ? (
            <p>
              Armand a trouvé le registre de comptes dans le bureau. Il s'est rendu compte que Béatrice savait tout et qu'elle lui tendait un piège.
            </p>
          ) : (
            <p className="italic text-[#635c52]">???? (En attente de preuves)</p>
          )}
        </div>

        {/* 4. L'Arme du Crime */}
        <div className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
          isWeaponUnlocked
            ? 'bg-[#24211e] border-[#8f7223]/50 text-[#e8e2d5]'
            : 'bg-[#181615] border-[#2b2724] opacity-50'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-serif font-bold text-sm text-[#c59b27]">
              4. L'Arme et les empreintes (A♠)
            </h4>
            {isWeaponUnlocked ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-[#635c52]" />}
          </div>
          {isWeaponUnlocked ? (
            <p>
              L'objet du crime a été retrouvé près de l'entrée. L'empreinte d'Armand y est clairement identifiable.
            </p>
          ) : (
            <p className="italic text-[#635c52]">???? (En attente de preuves)</p>
          )}
        </div>

        {/* 5. Vrai Meurtre */}
        <div className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
          isRealMurderUnlocked
            ? 'bg-[#24211e] border-red-700/60 text-white'
            : 'bg-[#181615] border-[#2b2724] opacity-50'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-serif font-bold text-sm text-red-400">
              5. Conclusion : Le meurtre réel
            </h4>
            {isRealMurderUnlocked ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <Lock className="w-4 h-4 text-[#635c52]" />}
          </div>
          {isRealMurderUnlocked ? (
            <p>
              Armand est parti retrouver Béatrice dans sa cachette pour la faire taire. Le faux meurtre est devenu un meurtre réel. Firmin s'est tu par couardise.
            </p>
          ) : (
            <p className="italic text-[#635c52]">???? (En attente de preuves)</p>
          )}
        </div>
      </div>

      {/* --- FAUSSES PISTES DÉCOUVERTES --- */}
      {(isHerring7Unlocked || isHerringJUnlocked) && (
        <div className="bg-[#1c1a18] border border-[#3a3530] rounded-xl p-4 space-y-2">
          <h3 className="text-xs font-bold font-serif text-amber-400 uppercase tracking-wider">
            FAUSSES PISTES ÉTUDIÉES
          </h3>
          {isHerring7Unlocked && (
            <div className="text-xs text-[#8c8376]">
              • <strong className="text-[#e8e2d5]">Empreinte de Firmin (7♠) :</strong> Présente sur la scène mais expliquée par sa maladresse et sa présence lors de la fausse mise en scène.
            </div>
          )}
          {isHerringJUnlocked && (
            <div className="text-xs text-[#8c8376]">
              • <strong className="text-[#e8e2d5]">Message de Firmin (J♥) :</strong> Firmin savait où elle se cachait car il l'a aidée, mais il n'est pas le meurtrier.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
