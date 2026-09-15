import { GameState } from '../types/game';
import { CHRONOLOGY_ITEMS } from '../data/story';

const STORAGE_KEY = 'le_dernier_service_save_v1';

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createInitialState(): GameState {
  const defaultChronologyOrder = shuffleArray(CHRONOLOGY_ITEMS.map((item) => item.id));

  return {
    currentStage: 0,
    discoveredCards: [],
    earlyCards: [],
    foundClubs: [],
    spentClubs: 0,
    currencyIdentified: false,
    solvedPuzzles: {},
    chronologyOrder: defaultChronologyOrder,
    storyLogs: [
      {
        id: 'start_log',
        timestamp: Date.now(),
        title: 'DÉBUT DE L\'ENQUÊTE',
        text: 'L\'enquête sur la disparition de Béatrice de Carreau commence. Retrouvez le valet Firmin.',
        type: 'milestone'
      }
    ],
    masterMode: false,
    pendingSpeech: null,
    activeTab: 'enquete'
  };
}

export function loadSavedGame(): GameState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return createInitialState();
    const parsed = JSON.parse(data);
    return {
      ...createInitialState(),
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to load saved game, resetting state:', err);
    return createInitialState();
  }
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save game to localStorage:', err);
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
}
