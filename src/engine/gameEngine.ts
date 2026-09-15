import { GameState, Suit, Rank, Card, PendingSpeech } from '../types/game';
import { CARDS_DB, buildCardId } from '../data/cards';
import { SPEECHES, STAGE_GOALS, CORRECT_CHRONOLOGY_ORDER } from '../data/story';
import { saveGame } from './storage';

export type CardValidationResult =
  | { type: 'unknown'; cardId: string }
  | { type: 'already_found'; card: Card }
  | { type: 'early_discovery'; card: Card }
  | { type: 'main_success'; card: Card }
  | { type: 'currency_success'; card: Card; value: number }
  | { type: 'red_herring_success'; card: Card };

/**
 * Calculate available clover balance: sum of found clovers minus spent clovers
 */
export function getCloverBalance(state: GameState): { totalFound: number; balance: number } {
  let totalFound = 0;
  state.foundClubs.forEach((id) => {
    const card = CARDS_DB[id];
    if (card && card.value) {
      totalFound += card.value;
    }
  });
  const balance = Math.max(0, totalFound - state.spentClubs);
  return { totalFound, balance };
}

/**
 * Main card validation routine
 */
export function validateCardInput(
  state: GameState,
  suit: Suit,
  rank: Rank
): { newState: GameState; result: CardValidationResult } {
  const cardId = buildCardId(suit, rank);
  const card = CARDS_DB[cardId];
  let newState = { ...state, lastDiscoveredCardId: cardId };

  if (!card) {
    return {
      newState,
      result: { type: 'unknown', cardId }
    };
  }

  // --- TRÈFLES / CURRENCY ---
  if (card.type === 'currency') {
    if (newState.foundClubs.includes(cardId)) {
      return { newState, result: { type: 'already_found', card } };
    }

    const updatedFound = [...newState.foundClubs, cardId];
    const updatedDiscovered = Array.from(new Set([...newState.discoveredCards, cardId]));

    newState = {
      ...newState,
      foundClubs: updatedFound,
      discoveredCards: updatedDiscovered,
      storyLogs: [
        {
          id: `log_currency_${Date.now()}`,
          timestamp: Date.now(),
          title: `CARTE TROUVÉE : ${card.title}`,
          text: `Vous avez découvert ${card.title}. (+${card.value} sous)`,
          type: 'clue'
        },
        ...newState.storyLogs
      ]
    };

    saveGame(newState);
    return {
      newState,
      result: { type: 'currency_success', card, value: card.value || 0 }
    };
  }

  // --- FAUSSES PISTES / RED HERRINGS ---
  if (card.type === 'redHerring') {
    if (newState.discoveredCards.includes(cardId)) {
      return { newState, result: { type: 'already_found', card } };
    }

    const updatedDiscovered = [...newState.discoveredCards, cardId];
    newState = {
      ...newState,
      discoveredCards: updatedDiscovered,
      storyLogs: [
        {
          id: `log_herring_${Date.now()}`,
          timestamp: Date.now(),
          title: card.title,
          text: card.description || '',
          type: 'clue'
        },
        ...newState.storyLogs
      ]
    };

    saveGame(newState);
    return {
      newState,
      result: { type: 'red_herring_success', card }
    };
  }

  // --- MAIN PROGRESSION CARDS ---
  if (card.type === 'main') {
    const requiredForThisStage = getRequiredCardIdForStage(newState.currentStage);

    // Is this card expected for the CURRENT stage?
    if (cardId === requiredForThisStage) {
      // Advance to next stage!
      newState = advanceStageAfterMainCard(newState, cardId);
      return {
        newState,
        result: { type: 'main_success', card }
      };
    }

    // Is it a card for a FUTURE stage? -> Early discovery!
    if (card.requiredStage !== undefined && card.requiredStage > newState.currentStage) {
      if (!newState.discoveredCards.includes(cardId)) {
        newState = {
          ...newState,
          discoveredCards: [...newState.discoveredCards, cardId],
          earlyCards: Array.from(new Set([...newState.earlyCards, cardId]))
        };
        saveGame(newState);
      }
      return {
        newState,
        result: { type: 'early_discovery', card }
      };
    }

    // Otherwise, card belongs to a past stage already passed
    return {
      newState,
      result: { type: 'already_found', card }
    };
  }

  return { newState, result: { type: 'unknown', cardId } };
}

/**
 * Returns which card is required to advance from the current stage
 */
export function getRequiredCardIdForStage(stage: number): string | null {
  switch (stage) {
    case 0: return 'J_diamond';
    case 1: return 'K_diamond';
    case 4: return 'Q_diamond';
    case 5: return 'A_heart';
    case 6: return '8_heart';
    case 8: return '10_diamond';
    case 9: return 'A_spade';
    default: return null;
  }
}

/**
 * Advances the game stage after a correct main card is validated
 */
function advanceStageAfterMainCard(state: GameState, cardId: string): GameState {
  let newState: GameState = {
    ...state,
    discoveredCards: Array.from(new Set([...state.discoveredCards, cardId])),
    earlyCards: state.earlyCards.filter((id) => id !== cardId)
  };

  if (cardId === 'J_diamond') {
    // Stage 0 -> 1. Trigger speech for Firmin 1
    newState.currentStage = 1;
    newState.pendingSpeech = {
      speaker: 'FIRMIN DE CARREAU',
      title: SPEECHES.FIRMIN_1.title,
      text: SPEECHES.FIRMIN_1.text,
      nextStage: 1
    };
  } else if (cardId === 'K_diamond') {
    // Stage 1 -> 2. Trigger Armand revelation
    newState.currentStage = 2;
    newState.pendingSpeech = {
      speaker: 'FIRMIN (AU SUJET D\'ARMAND)',
      title: SPEECHES.ARMAND_1.title,
      text: SPEECHES.ARMAND_1.text,
      nextStage: 2
    };
  } else if (cardId === 'Q_diamond') {
    // Stage 4 -> 5. Trigger Beatrice letter
    newState.currentStage = 5;
    newState.pendingSpeech = {
      speaker: 'BÉATRICE DE CARREAU',
      title: SPEECHES.BEATRICE_LETTER.title,
      text: SPEECHES.BEATRICE_LETTER.text,
      nextStage: 5
    };
  } else if (cardId === 'A_heart') {
    // Stage 5 -> 6. Fake heart recovered
    newState.currentStage = 6;
    newState.storyLogs = [
      {
        id: `log_a_heart_${Date.now()}`,
        timestamp: Date.now(),
        title: 'CŒUR RÉCUPÉRÉ (A♥)',
        text: 'Rassurez-vous. Il est faux. Enfin... Nous l\'espérons. Béatrice avait donc réellement préparé une fausse scène de meurtre.',
        type: 'milestone'
      },
      ...newState.storyLogs
    ];
  } else if (cardId === '8_heart') {
    // Stage 6 -> 7. Folded card puzzle active
    newState.currentStage = 7;
    newState.storyLogs = [
      {
        id: `log_8_heart_${Date.now()}`,
        timestamp: Date.now(),
        title: 'CARTE PLIÉE (8♥)',
        text: 'Cette carte semble avoir été conçue pour être manipulée. Pliez-la comme elle était à l\'origine.',
        type: 'milestone'
      },
      ...newState.storyLogs
    ];
  } else if (cardId === '10_diamond') {
    // Stage 8 -> 9. Les comptes
    newState.currentStage = 9;
    newState.pendingSpeech = {
      speaker: 'NOTE DANGER DANS LES COMPTES',
      title: SPEECHES.COMPTES_NOTE.title,
      text: SPEECHES.COMPTES_NOTE.text,
      nextStage: 9
    };
  } else if (cardId === 'A_spade') {
    // Stage 9 -> 10. L'Arme found -> Trigger Firmin final testimony
    newState.currentStage = 10;
    newState.pendingSpeech = {
      speaker: 'FIRMIN DE CARREAU',
      title: SPEECHES.FIRMIN_FINAL.title,
      text: SPEECHES.FIRMIN_FINAL.text,
      nextStage: 10
    };
  }

  // Save game
  saveGame(newState);

  // Check if the NEW stage's required card was already found early!
  return checkEarlyUnlocks(newState);
}

/**
 * Checks if the current stage can be automatically passed because its card was discovered early
 */
export function checkEarlyUnlocks(state: GameState): GameState {
  const reqCardId = getRequiredCardIdForStage(state.currentStage);
  if (reqCardId && state.earlyCards.includes(reqCardId)) {
    // Auto trigger discovery for early card!
    return advanceStageAfterMainCard(state, reqCardId);
  }
  return state;
}

/**
 * Solve Currency Identification Puzzle ("1 sous = Trèfle")
 */
export function solveCurrencyPuzzle(state: GameState, answer: string): { newState: GameState; success: boolean } {
  const normalized = answer.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized === 'trefle' || normalized === 'trefles') {
    let newState: GameState = {
      ...state,
      currencyIdentified: true,
      currentStage: 3,
      solvedPuzzles: { ...state.solvedPuzzles, currency: true },
      storyLogs: [
        {
          id: `log_currency_solved_${Date.now()}`,
          timestamp: Date.now(),
          title: 'MONNAIE IDENTIFIÉE',
          text: 'Les trèfles servent désormais de monnaie. Le portefeuille est débloqué !',
          type: 'milestone'
        },
        ...state.storyLogs
      ]
    };
    newState = checkEarlyUnlocks(newState);
    saveGame(newState);
    return { newState, success: true };
  }
  return { newState: state, success: false };
}

/**
 * Pay Firmin 5♣ to unlock testimony
 */
export function payFirmin(state: GameState): { newState: GameState; success: boolean } {
  const { balance } = getCloverBalance(state);
  if (balance < 5) {
    return { newState: state, success: false };
  }

  let newState: GameState = {
    ...state,
    spentClubs: state.spentClubs + 5,
    currentStage: 4,
    pendingSpeech: {
      speaker: 'FIRMIN DE CARREAU',
      title: SPEECHES.FIRMIN_PAID.title,
      text: SPEECHES.FIRMIN_PAID.text,
      nextStage: 4
    }
  };

  newState = checkEarlyUnlocks(newState);
  saveGame(newState);
  return { newState, success: true };
}

/**
 * Solve Folded Card Puzzle ("BUREAU")
 */
export function solveFoldPuzzle(state: GameState, answer: string): { newState: GameState; success: boolean } {
  const normalized = answer.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized === 'bureau' || normalized === 'lebureau') {
    let newState: GameState = {
      ...state,
      currentStage: 8,
      solvedPuzzles: { ...state.solvedPuzzles, foldedCard: true },
      storyLogs: [
        {
          id: `log_fold_solved_${Date.now()}`,
          timestamp: Date.now(),
          title: 'LIEU DÉCRYPTÉ : BUREAU',
          text: 'Le pliage indique le Bureau. Rendez-vous dans le bureau pour chercher la suite des preuves.',
          type: 'milestone'
        },
        ...state.storyLogs
      ]
    };
    newState = checkEarlyUnlocks(newState);
    saveGame(newState);
    return { newState, success: true };
  }
  return { newState: state, success: false };
}

/**
 * Solve Chronology Puzzle (A -> B -> C -> D -> E -> F -> G)
 */
export function checkChronologySolution(state: GameState, currentOrder: string[]): { newState: GameState; success: boolean } {
  const isCorrect = currentOrder.join('') === CORRECT_CHRONOLOGY_ORDER.join('');
  if (isCorrect) {
    let newState: GameState = {
      ...state,
      currentStage: 11,
      chronologyOrder: currentOrder,
      solvedPuzzles: { ...state.solvedPuzzles, chronology: true },
      storyLogs: [
        {
          id: `log_chrono_solved_${Date.now()}`,
          timestamp: Date.now(),
          title: 'HISTOIRE RECONSTITUÉE',
          text: 'Armand volait Béatrice. Béatrice l\'a découvert. Elle a préparé un faux meurtre pour le piéger. Armand a découvert son plan. Il l\'a retrouvée et l\'a réellement tuée. Firmin a gardé le silence par peur.',
          type: 'milestone'
        },
        ...state.storyLogs
      ]
    };
    saveGame(newState);
    return { newState, success: true };
  }
  return { newState: { ...state, chronologyOrder: currentOrder }, success: false };
}

/**
 * Accusation Final Choice
 */
export function makeAccusation(state: GameState, suspect: string): { newState: GameState; success: boolean } {
  if (suspect === 'ARMAND') {
    let newState: GameState = {
      ...state,
      currentStage: 12,
      selectedSuspect: 'ARMAND',
      solvedPuzzles: { ...state.solvedPuzzles, accusation: true },
      pendingSpeech: {
        speaker: 'BÉATRICE DE CARREAU',
        title: SPEECHES.BEATRICE_FINAL.title,
        text: SPEECHES.BEATRICE_FINAL.text,
        nextStage: 12
      }
    };
    saveGame(newState);
    return { newState, success: true };
  }
  return { newState: { ...state, selectedSuspect: suspect }, success: false };
}

/**
 * MJ completes roleplay speech and adds to logs
 */
export function completePendingSpeech(state: GameState): GameState {
  if (!state.pendingSpeech) return state;

  const speech = state.pendingSpeech;
  const newLog = {
    id: `log_speech_${Date.now()}`,
    timestamp: Date.now(),
    title: speech.title,
    text: speech.text,
    speaker: speech.speaker,
    type: 'testimony' as const
  };

  let newState: GameState = {
    ...state,
    pendingSpeech: null,
    storyLogs: [newLog, ...state.storyLogs]
  };

  saveGame(newState);
  return newState;
}
