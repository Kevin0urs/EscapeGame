import type { Card } from './types';

// ============================================================
// BASE DE DONNÉES DES CARTES
// ============================================================

export const CARDS: Card[] = [
  // --- Cartes principales (suivent la progression narrative) ---
  {
    id: 'Jd',
    suit: 'diamond',
    rank: 'J',
    type: 'main',
    requiredPhase: 'intro',
    revealPhase: 'firmin_intro',
  },
  {
    id: 'Kd',
    suit: 'diamond',
    rank: 'K',
    type: 'main',
    requiredPhase: 'find_kd',
    revealPhase: 'armand_reveal',
  },
  {
    id: 'Qd',
    suit: 'diamond',
    rank: 'Q',
    type: 'main',
    requiredPhase: 'find_qd',
    revealPhase: 'beatrice_reveal',
  },
  {
    id: 'Ah',
    suit: 'heart',
    rank: 'A',
    type: 'main',
    requiredPhase: 'find_ah',
    revealPhase: 'find_8h',
  },
  {
    id: '8h',
    suit: 'heart',
    rank: '8',
    type: 'main',
    requiredPhase: 'find_8h',
    revealPhase: 'bureau_puzzle',
  },
  {
    id: '10d',
    suit: 'diamond',
    rank: '10',
    type: 'main',
    requiredPhase: 'find_10d',
    revealPhase: 'comptes_reveal',
  },
  {
    id: 'As',
    suit: 'spade',
    rank: 'A',
    type: 'main',
    requiredPhase: 'find_as',
    revealPhase: 'firmin_final',
  },

  // --- Cartes monnaie (trèfles, découvrables à tout moment) ---
  { id: '2c', suit: 'club', rank: '2', type: 'currency', currencyValue: 2 },
  { id: '3c', suit: 'club', rank: '3', type: 'currency', currencyValue: 3 },
  { id: '4c', suit: 'club', rank: '4', type: 'currency', currencyValue: 4 },
  { id: '5c', suit: 'club', rank: '5', type: 'currency', currencyValue: 5 },
  { id: '6c', suit: 'club', rank: '6', type: 'currency', currencyValue: 6 },

  // --- Fausses pistes (indépendantes de la progression) ---
  { id: '7s', suit: 'spade', rank: '7', type: 'redHerring' },
  { id: 'Jh', suit: 'heart', rank: 'J', type: 'redHerring' },
];

export function findCard(suit: string, rank: string): Card | undefined {
  const suitMap: Record<string, string> = {
    diamond: 'diamond',
    heart: 'heart',
    spade: 'spade',
    club: 'club',
  };
  const s = suitMap[suit];
  return CARDS.find((c) => c.suit === s && c.rank === rank);
}

export function getCardById(id: string): Card | undefined {
  return CARDS.find((c) => c.id === id);
}

export const SUIT_SYMBOLS: Record<string, string> = {
  diamond: '♦',
  heart: '♥',
  spade: '♠',
  club: '♣',
};

export const SUIT_NAMES_FR: Record<string, string> = {
  diamond: 'Carreau',
  heart: 'Cœur',
  spade: 'Pique',
  club: 'Trèfle',
};

export const RANK_NAMES_FR: Record<string, string> = {
  A: 'As',
  J: 'Valet',
  Q: 'Dame',
  K: 'Roi',
};

export function cardLabel(card: Card): string {
  const symbol = SUIT_SYMBOLS[card.suit];
  return `${card.rank}${symbol}`;
}