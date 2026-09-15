// ============================================================
// TYPES — LE DERNIER SERVICE
// ============================================================

export type Suit = 'diamond' | 'heart' | 'spade' | 'club';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type CardType = 'main' | 'currency' | 'redHerring';

export type GamePhase =
  | 'intro'            // trouver J♦
  | 'firmin_intro'     // J♦ trouvé → MJ lit Firmin speech 1 → trouver K♦
  | 'find_kd'          // trouver K♦
  | 'armand_reveal'    // K♦ trouvé → MJ lit Firmin speech 2 → énigme monnaie
  | 'currency_puzzle'  // identifier la monnaie (1 sou = trèfle)
  | 'find_clubs'       // collecter les trèfles + payer 5♣
  | 'firmin_testimony' // payer 5♣ → MJ lit témoignage Firmin → trouver Q♦
  | 'find_qd'          // trouver Q♦ (jardin accessible)
  | 'beatrice_reveal'  // Q♦ trouvé → MJ lit lettre Béatrice → trouver A♥
  | 'find_ah'          // trouver A♥
  | 'find_8h'          // A♥ trouvé → trouver 8♥
  | 'bureau_puzzle'    // 8♥ trouvé → énigme BUREAU (pliage)
  | 'find_10d'         // Bureau résolu → trouver 10♦
  | 'comptes_reveal'   // 10♦ trouvé → MJ lit note Béatrice → trouver A♠
  | 'find_as'          // trouver A♠
  | 'firmin_final'     // A♠ trouvé → MJ lit témoignage final Firmin → chronologie
  | 'chronologie'      // puzzle reconstitution chronologique
  | 'accusation'       // qui a tué Béatrice ?
  | 'end';             // écran final

export const PHASE_ORDER: GamePhase[] = [
  'intro', 'firmin_intro', 'find_kd', 'armand_reveal', 'currency_puzzle',
  'find_clubs', 'firmin_testimony', 'find_qd', 'beatrice_reveal', 'find_ah',
  'find_8h', 'bureau_puzzle', 'find_10d', 'comptes_reveal', 'find_as',
  'firmin_final', 'chronologie', 'accusation', 'end',
];

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  type: CardType;
  /** Phase à laquelle cette carte peut être validée normalement */
  requiredPhase?: GamePhase;
  /** Phase vers laquelle on bascule après découverte */
  revealPhase?: GamePhase;
  /** Valeur en trèfles (cartes club uniquement) */
  currencyValue?: number;
}

export interface CharacterSpeech {
  characterName: string;
  characterEmoji: string;
  lines: string[];
  audioUrl?: string;
}

export interface GameState {
  phase: GamePhase;
  discoveredCards: string[];    // cardIds trouvées au bon moment
  earlyCards: string[];         // cardIds trouvées trop tôt
  foundClubs: string[];         // cardIds des trèfles trouvés
  spentClubs: number;           // total dépensé en trèfles
  walletUnlocked: boolean;
  currencyIdentified: boolean;
  firminTestimonyPaid: boolean;
  gardenUnlocked: boolean;
  bureauUnlocked: boolean;
  mjSpeechDone: boolean;        // le MJ a validé le discours du personnage courant
  solvedPuzzles: string[];
  lastRevealedCard: string | null;
  lastSaved: string | null;
}

export type Tab = 'enquete' | 'inventaire' | 'trefles' | 'dossier';

export interface AppState {
  screen: 'home' | 'game' | 'cardInput' | 'mj';
  tab: Tab;
  game: GameState;
  logoTapCount: number;
  logoTapTimer: ReturnType<typeof setTimeout> | null;
}