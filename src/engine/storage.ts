import type { GameState } from './types';
import { createInitialState } from './progression';

const SAVE_KEY = 'le_dernier_service_v1';

export function saveGame(state: GameState): void {
  try {
    const toSave: GameState = { ...state, lastSaved: new Date().toISOString() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Impossible de sauvegarder la partie:', e);
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    // Validation minimale
    if (!parsed.phase || !Array.isArray(parsed.discoveredCards)) return null;
    return parsed;
  } catch (e) {
    console.warn('Impossible de charger la partie:', e);
    return null;
  }
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function resetGame(): GameState {
  localStorage.removeItem(SAVE_KEY);
  return createInitialState();
}