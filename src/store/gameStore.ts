import { create } from 'zustand';
import type { GameState, Tab } from '../engine/types';
import {
  createInitialState,
  discoverCard,
  completeMJSpeech as engineCompleteMJSpeech,
  solveCurrencyPuzzle as engineSolveCurrencyPuzzle,
  payForFirminTestimony,
  solveBureauPuzzle as engineSolveBureau,
  solveChronologie as engineSolveChronologie,
  solveAccusation as engineSolveAccusation,
  checkEarlyCardUnlock,
  mjForceNextStage,
  mjAddClubs,
  mjMarkCardFound,
  hasPendingMJSpeech,
  getClubBalance,
} from '../engine/progression';
import { saveGame, loadGame, resetGame, hasSavedGame } from '../engine/storage';
import type { DiscoverResult } from '../engine/progression';

interface AppStore {
  // --- État UI ---
  screen: 'home' | 'game' | 'cardInput' | 'mj';
  tab: Tab;
  pendingReveal: { cardId: string; result: DiscoverResult } | null;
  logoTapCount: number;

  // --- État de jeu ---
  game: GameState;
  hasSave: boolean;

  // --- Navigation ---
  goToHome: () => void;
  goToGame: () => void;
  goToCardInput: () => void;
  goToMJ: () => void;
  setTab: (tab: Tab) => void;
  dismissReveal: () => void;

  // --- Gestion logo (MJ secret) ---
  tapLogo: () => void;

  // --- Actions de jeu ---
  startNewGame: () => void;
  resumeGame: () => void;
  submitCard: (suit: string, rank: string) => DiscoverResult;
  completeMJSpeech: () => void;
  solveCurrencyPuzzle: () => void;
  payFirmin: () => boolean;
  solveBureau: () => void;
  solveChronologie: () => void;
  solveAccusation: () => void;

  // --- Actions MJ ---
  mjForceNext: () => void;
  mjAddFiveClubs: () => void;
  mjMarkCard: (cardId: string) => void;
  mjReset: () => void;
}

let logoTapTimer: ReturnType<typeof setTimeout> | null = null;

export const useGameStore = create<AppStore>((set, get) => ({
  screen: 'home',
  tab: 'enquete',
  pendingReveal: null,
  logoTapCount: 0,
  game: loadGame() ?? createInitialState(),
  hasSave: hasSavedGame(),

  // --- Navigation ---
  goToHome: () => set({ screen: 'home' }),
  goToGame: () => set({ screen: 'game', tab: 'enquete' }),
  goToCardInput: () => set({ screen: 'cardInput' }),
  goToMJ: () => set({ screen: 'mj' }),
  setTab: (tab) => set({ tab }),
  dismissReveal: () => set({ pendingReveal: null }),

  // --- Logo tap (5x pour MJ) ---
  tapLogo: () => {
    const { logoTapCount, game, screen } = get();
    const newCount = logoTapCount + 1;

    if (logoTapTimer) clearTimeout(logoTapTimer);
    logoTapTimer = setTimeout(() => {
      set({ logoTapCount: 0 });
    }, 2000);

    if (newCount >= 5) {
      set({ logoTapCount: 0 });
      if (logoTapTimer) clearTimeout(logoTapTimer);
      // Si on est en jeu et qu'il y a un discours MJ en attente, aller dans MJ
      // Sinon, aller dans MJ dashboard
      set({ screen: 'mj' });
    } else {
      set({ logoTapCount: newCount });
    }
  },

  // --- Démarrage ---
  startNewGame: () => {
    const fresh = createInitialState();
    saveGame(fresh);
    set({ game: fresh, screen: 'game', tab: 'enquete', hasSave: true });
  },

  resumeGame: () => {
    const saved = loadGame();
    if (saved) {
      set({ game: saved, screen: 'game', tab: 'enquete' });
    }
  },

  // --- Soumettre une carte ---
  submitCard: (suit: string, rank: string) => {
    const { game } = get();
    const { result, newState } = discoverCard(suit, rank, game);

    // Vérifier si une carte early est maintenant débloquée
    const { newState: finalState, unlockedCardId } = checkEarlyCardUnlock(newState);

    saveGame(finalState);
    set({ game: finalState, screen: 'game', tab: 'enquete' });

    // Si une carte early vient de se débloquer, afficher sa révélation
    if (unlockedCardId) {
      set({ pendingReveal: { cardId: unlockedCardId, result: { type: 'main_card', cardId: unlockedCardId, newPhase: finalState.phase } } });
    } else if (result.type === 'main_card' || result.type === 'currency_added' || result.type === 'red_herring') {
      const cardId = 'cardId' in result ? result.cardId : '';
      set({ pendingReveal: { cardId, result } });
    }

    return result;
  },

  // --- MJ Speech ---
  completeMJSpeech: () => {
    const { game } = get();
    const newState = engineCompleteMJSpeech(game);
    // Vérifier si une carte early se débloque
    const { newState: finalState } = checkEarlyCardUnlock(newState);
    saveGame(finalState);
    set({ game: finalState, screen: 'game', tab: 'enquete' });
  },

  // --- Puzzles ---
  solveCurrencyPuzzle: () => {
    const { game } = get();
    const newState = engineSolveCurrencyPuzzle(game);
    saveGame(newState);
    set({ game: newState });
  },

  payFirmin: () => {
    const { game } = get();
    if (getClubBalance(game) < 5) return false;
    const newState = payForFirminTestimony(game);
    saveGame(newState);
    set({ game: newState });
    return true;
  },

  solveBureau: () => {
    const { game } = get();
    const newState = engineSolveBureau(game);
    saveGame(newState);
    set({ game: newState });
  },

  solveChronologie: () => {
    const { game } = get();
    const newState = engineSolveChronologie(game);
    saveGame(newState);
    set({ game: newState });
  },

  solveAccusation: () => {
    const { game } = get();
    const newState = engineSolveAccusation(game);
    saveGame(newState);
    set({ game: newState });
  },

  // --- Actions MJ ---
  mjForceNext: () => {
    const { game } = get();
    const newState = mjForceNextStage(game);
    saveGame(newState);
    set({ game: newState });
  },

  mjAddFiveClubs: () => {
    const { game } = get();
    const newState = mjAddClubs(game, 5);
    saveGame(newState);
    set({ game: newState });
  },

  mjMarkCard: (cardId: string) => {
    const { game } = get();
    const newState = mjMarkCardFound(cardId, game);
    saveGame(newState);
    set({ game: newState });
  },

  mjReset: () => {
    const fresh = resetGame();
    set({ game: fresh, screen: 'home', hasSave: false, tab: 'enquete', pendingReveal: null });
  },
}));

// Sélecteurs utiles
export const selectClubBalance = (store: AppStore) => {
  return store.game.foundClubs.reduce((sum, id) => {
    const val = [
      { id: '2c', v: 2 }, { id: '3c', v: 3 }, { id: '4c', v: 4 },
      { id: '5c', v: 5 }, { id: '6c', v: 6 },
    ].find((x) => x.id === id)?.v ?? 0;
    return sum + val;
  }, 0) - store.game.spentClubs;
};

export const selectHasMJSpeech = (store: AppStore) => hasPendingMJSpeech(store.game);