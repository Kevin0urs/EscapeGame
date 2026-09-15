import type { GameState, GamePhase } from './types';
import { PHASE_ORDER } from './types';
import { findCard, getCardById } from './cards';
import { DOSSIER_ENTRIES } from './scenario';

// ============================================================
// MOTEUR DE PROGRESSION — LE DERNIER SERVICE
// Fonctions pures (pas d'effets de bord React)
// ============================================================

export function createInitialState(): GameState {
  return {
    phase: 'intro',
    discoveredCards: [],
    earlyCards: [],
    foundClubs: [],
    spentClubs: 0,
    walletUnlocked: false,
    currencyIdentified: false,
    firminTestimonyPaid: false,
    gardenUnlocked: false,
    bureauUnlocked: false,
    mjSpeechDone: false,
    solvedPuzzles: [],
    lastRevealedCard: null,
    lastSaved: null,
  };
}

// Indice de la phase dans l'ordre de progression
function phaseIndex(phase: GamePhase): number {
  return PHASE_ORDER.indexOf(phase);
}

// Une carte principale est-elle accessible maintenant ?
function isMainCardAccessible(cardId: string, state: GameState): boolean {
  const card = getCardById(cardId);
  if (!card || card.type !== 'main') return false;
  if (!card.requiredPhase) return false;
  return state.phase === card.requiredPhase;
}

// Une carte principale a-t-elle été trouvée trop tôt ?
function isCardTooEarly(cardId: string, state: GameState): boolean {
  const card = getCardById(cardId);
  if (!card || card.type !== 'main') return false;
  if (!card.requiredPhase) return false;
  return phaseIndex(state.phase) < phaseIndex(card.requiredPhase);
}

// Calcul du solde de trèfles
export function getClubBalance(state: GameState): number {
  const total = state.foundClubs.reduce((sum, id) => {
    const card = getCardById(id);
    return sum + (card?.currencyValue ?? 0);
  }, 0);
  return Math.max(0, total - state.spentClubs);
}

export function getTotalClubsFound(state: GameState): number {
  return state.foundClubs.reduce((sum, id) => {
    const card = getCardById(id);
    return sum + (card?.currencyValue ?? 0);
  }, 0);
}

// ============================================================
// TRAITEMENT D'UNE CARTE SAISIE
// ============================================================

export type DiscoverResult =
  | { type: 'already_found' }
  | { type: 'early'; cardId: string }
  | { type: 'currency_added'; cardId: string; value: number; newBalance: number }
  | { type: 'currency_duplicate' }
  | { type: 'red_herring'; cardId: string }
  | { type: 'main_card'; cardId: string; newPhase: GamePhase }
  | { type: 'not_found' };

export function discoverCard(
  suit: string,
  rank: string,
  state: GameState
): { result: DiscoverResult; newState: GameState } {
  const card = findCard(suit, rank);
  if (!card) return { result: { type: 'not_found' }, newState: state };

  const id = card.id;

  // Cas: carte déjà enregistrée correctement
  if (state.discoveredCards.includes(id)) {
    return { result: { type: 'already_found' }, newState: state };
  }

  // Carte monnaie (trèfle)
  if (card.type === 'currency') {
    if (state.foundClubs.includes(id)) {
      return { result: { type: 'currency_duplicate' }, newState: state };
    }
    const newState: GameState = {
      ...state,
      foundClubs: [...state.foundClubs, id],
    };
    const newBalance = getClubBalance(newState);
    return {
      result: { type: 'currency_added', cardId: id, value: card.currencyValue ?? 0, newBalance },
      newState,
    };
  }

  // Fausse piste
  if (card.type === 'redHerring') {
    // Enregistrer comme découverte et ajouter entrée dossier
    const dossierKey = id === '7s' ? 'fausse_piste_7s' : id === 'Jh' ? 'fausse_piste_jh' : null;
    const newSolved = dossierKey && !state.solvedPuzzles.includes(dossierKey)
      ? [...state.solvedPuzzles, dossierKey]
      : state.solvedPuzzles;
    const newState: GameState = {
      ...state,
      discoveredCards: [...state.discoveredCards, id],
      solvedPuzzles: newSolved,
    };
    return { result: { type: 'red_herring', cardId: id }, newState };
  }

  // Carte principale trouvée trop tôt
  if (isCardTooEarly(id, state)) {
    const newState: GameState = {
      ...state,
      earlyCards: state.earlyCards.includes(id) ? state.earlyCards : [...state.earlyCards, id],
    };
    return { result: { type: 'early', cardId: id }, newState };
  }

  // Carte principale trouvée au bon moment
  if (isMainCardAccessible(id, state) || state.earlyCards.includes(id)) {
    const newPhase = card.revealPhase ?? state.phase;
    const newState: GameState = {
      ...state,
      discoveredCards: [...state.discoveredCards, id],
      earlyCards: state.earlyCards.filter((c) => c !== id),
      phase: newPhase,
      mjSpeechDone: false,
      lastRevealedCard: id,
    };
    return {
      result: { type: 'main_card', cardId: id, newPhase },
      newState,
    };
  }

  // Carte principale pas encore accessible (pas au bon stage)
  return { result: { type: 'early', cardId: id }, newState: {
    ...state,
    earlyCards: state.earlyCards.includes(id) ? state.earlyCards : [...state.earlyCards, id],
  }};
}

// ============================================================
// TRANSITION DE PHASE — appelée après actions spéciales
// ============================================================

/** MJ a validé le discours du personnage → avancer à la prochaine phase */
export function completeMJSpeech(state: GameState): GameState {
  const NEXT_AFTER_MJ: Partial<Record<GamePhase, GamePhase>> = {
    firmin_intro: 'find_kd',
    armand_reveal: 'currency_puzzle',
    firmin_testimony: 'find_qd',
    beatrice_reveal: 'find_ah',
    comptes_reveal: 'find_as',
    firmin_final: 'chronologie',
  };

  const nextPhase = NEXT_AFTER_MJ[state.phase];
  if (!nextPhase) return state;

  const updates: Partial<GameState> = {
    phase: nextPhase,
    mjSpeechDone: true,
  };

  // Effets secondaires lors de certaines transitions
  if (state.phase === 'firmin_testimony') {
    updates.gardenUnlocked = true;
  }
  if (state.phase === 'bureau_puzzle') {
    updates.bureauUnlocked = true;
  }

  return { ...state, ...updates };
}

/** Énigme monnaie résolue */
export function solveCurrencyPuzzle(state: GameState): GameState {
  return {
    ...state,
    phase: 'find_clubs',
    currencyIdentified: true,
    walletUnlocked: true,
  };
}

/** Paiement du témoignage de Firmin */
export function payForFirminTestimony(state: GameState): GameState {
  if (getClubBalance(state) < 5) return state;
  return {
    ...state,
    phase: 'firmin_testimony',
    spentClubs: state.spentClubs + 5,
    firminTestimonyPaid: true,
    mjSpeechDone: false,
  };
}

/** Énigme BUREAU résolue */
export function solveBureauPuzzle(state: GameState): GameState {
  return {
    ...state,
    phase: 'find_10d',
    bureauUnlocked: true,
    solvedPuzzles: [...state.solvedPuzzles, 'bureau'],
  };
}

/** Puzzle chronologie résolu */
export function solveChronologie(state: GameState): GameState {
  return {
    ...state,
    phase: 'accusation',
    solvedPuzzles: [...state.solvedPuzzles, 'chronologie'],
  };
}

/** Accusation correcte */
export function solveAccusation(state: GameState): GameState {
  return {
    ...state,
    phase: 'end',
    solvedPuzzles: [...state.solvedPuzzles, 'accusation'],
  };
}

// ============================================================
// VÉRIFICATION DE CARTES EARLY DÉBLOQUÉES PAR LA PHASE
// Appelé à chaque changement de phase pour déclencher
// immédiatement une carte trouvée trop tôt.
// ============================================================

export function checkEarlyCardUnlock(state: GameState): { newState: GameState; unlockedCardId: string | null } {
  for (const cardId of state.earlyCards) {
    const card = getCardById(cardId);
    if (!card || !card.requiredPhase || !card.revealPhase) continue;
    if (state.phase === card.requiredPhase) {
      const newState: GameState = {
        ...state,
        discoveredCards: [...state.discoveredCards, cardId],
        earlyCards: state.earlyCards.filter((c) => c !== cardId),
        phase: card.revealPhase,
        mjSpeechDone: false,
        lastRevealedCard: cardId,
      };
      return { newState, unlockedCardId: cardId };
    }
  }
  return { newState: state, unlockedCardId: null };
}

// ============================================================
// MODE MJ — Actions d'urgence
// ============================================================

export function mjForceNextStage(state: GameState): GameState {
  const current = phaseIndex(state.phase);
  const nextIndex = Math.min(current + 1, PHASE_ORDER.length - 1);
  const nextPhase = PHASE_ORDER[nextIndex];

  // Appliquer les effets secondaires si saut de phase clé
  const updates: Partial<GameState> = { phase: nextPhase, mjSpeechDone: false };
  if (nextIndex >= phaseIndex('find_qd')) updates.gardenUnlocked = true;
  if (nextIndex >= phaseIndex('find_10d')) updates.bureauUnlocked = true;
  if (nextIndex >= phaseIndex('find_clubs')) {
    updates.currencyIdentified = true;
    updates.walletUnlocked = true;
  }

  return { ...state, ...updates };
}

export function mjAddClubs(state: GameState, amount: number = 5): GameState {
  // Ajouter les cartes de trèfle manquantes pour atteindre ~amount trèfles supplémentaires
  const ALL_CLUBS = ['2c', '3c', '4c', '5c', '6c'];
  const CLUB_VALUES: Record<string, number> = { '2c': 2, '3c': 3, '4c': 4, '5c': 5, '6c': 6 };

  let added = 0;
  const newFoundClubs = [...state.foundClubs];

  for (const id of ALL_CLUBS) {
    if (added >= amount) break;
    if (!newFoundClubs.includes(id)) {
      newFoundClubs.push(id);
      added += CLUB_VALUES[id];
    }
  }

  // Si toutes les cartes sont déjà trouvées, réduire spentClubs
  const newSpent = added === 0
    ? Math.max(0, state.spentClubs - amount)
    : state.spentClubs;

  return {
    ...state,
    foundClubs: newFoundClubs,
    spentClubs: newSpent,
    currencyIdentified: true,
    walletUnlocked: true,
  };
}

export function mjMarkCardFound(cardId: string, state: GameState): GameState {
  const card = getCardById(cardId);
  if (!card) return state;

  if (card.type === 'currency') {
    if (state.foundClubs.includes(cardId)) return state;
    return { ...state, foundClubs: [...state.foundClubs, cardId] };
  }

  if (card.type === 'redHerring') {
    if (state.discoveredCards.includes(cardId)) return state;
    return { ...state, discoveredCards: [...state.discoveredCards, cardId] };
  }

  return state;
}

// ============================================================
// UTILITAIRES DOSSIER
// ============================================================

export function getUnlockedDossierEntries(state: GameState) {
  return DOSSIER_ENTRIES.filter((entry) => {
    // Entrées fausses pistes : disponibles si carte trouvée
    if (entry.id === 'fausse_piste_7s') return state.discoveredCards.includes('7s');
    if (entry.id === 'fausse_piste_jh') return state.discoveredCards.includes('Jh');
    return phaseIndex(state.phase) >= phaseIndex(entry.unlockedAtPhase);
  });
}

// ============================================================
// PHASES AVEC DISCOURS MJ ACTIF
// ============================================================

export const MJ_SPEECH_PHASES: GamePhase[] = [
  'firmin_intro',
  'armand_reveal',
  'firmin_testimony',
  'beatrice_reveal',
  'comptes_reveal',
  'firmin_final',
];

export function hasPendingMJSpeech(state: GameState): boolean {
  return MJ_SPEECH_PHASES.includes(state.phase) && !state.mjSpeechDone;
}

// ============================================================
// UTILITAIRE : La carte attendue actuellement
// ============================================================

const PHASE_TO_EXPECTED_CARD: Partial<Record<GamePhase, string>> = {
  intro: 'Jd',
  find_kd: 'Kd',
  find_qd: 'Qd',
  find_ah: 'Ah',
  find_8h: '8h',
  find_10d: '10d',
  find_as: 'As',
};

export function getExpectedCard(state: GameState): string | null {
  return PHASE_TO_EXPECTED_CARD[state.phase] ?? null;
}