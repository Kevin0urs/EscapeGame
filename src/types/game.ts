export type Suit = 'diamond' | 'heart' | 'spade' | 'club';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type CardType = 'main' | 'currency' | 'redHerring';

export interface Card {
  id: string; // e.g., 'J_diamond', '3_club'
  suit: Suit;
  rank: Rank;
  type: CardType;
  title: string;
  subtitle?: string;
  description?: string;
  speaker?: string; // E.g., 'FIRMIN', 'ARMAND', 'BÉATRICE'
  value?: number; // For clovers: 2, 3, 4, 5, 6
  requiredStage?: number; // Stage where this main card triggers progression
  audioUrl?: string;
}

export type GameStage = 
  | 0  // Act 1: Find J♦ (Firmin)
  | 1  // Act 1: Found J♦ -> Find K♦ (Armand)
  | 2  // Act 2: Found K♦ -> Identify currency ("1 sous = ____")
  | 3  // Act 2: Currency identified -> Collect 5♣ to interrogate Firmin
  | 4  // Act 2: Paid 5♣ -> Search Garden for Q♦ (Béatrice)
  | 5  // Act 3: Found Q♦ -> Find A♥ (Faux Cœur) in cool place
  | 6  // Act 3: Found A♥ -> Find 8♥ (Carte pliée)
  | 7  // Act 3: Found 8♥ -> Solve Fold Puzzle -> "BUREAU"
  | 8  // Act 4: Solved BUREAU -> Search Bureau for 10♦ (Les Comptes)
  | 9  // Act 4: Found 10♦ -> Search for weapon A♠ near mirror/entrance
  | 10 // Act 4: Found A♠ -> Final testimony & Chronology puzzle
  | 11 // Act 5: Solved Chronology -> Accuse suspect
  | 12; // Act 5: Accused ARMAND -> Final Beatrice Monologue / FIN

export interface StoryLog {
  id: string;
  timestamp: number;
  title: string;
  text: string;
  speaker?: string;
  type: 'milestone' | 'clue' | 'testimony';
}

export interface PendingSpeech {
  speaker: string;
  title: string;
  text: string;
  nextStage?: GameStage;
  logId?: string;
}

export interface GameState {
  currentStage: GameStage;
  discoveredCards: string[];
  earlyCards: string[];
  foundClubs: string[];
  spentClubs: number;
  currencyIdentified: boolean;
  solvedPuzzles: {
    currency?: boolean;
    foldedCard?: boolean;
    chronology?: boolean;
    accusation?: boolean;
  };
  selectedSuspect?: string;
  chronologyOrder: string[]; // Shuffled event IDs for Chronology puzzle
  storyLogs: StoryLog[];
  masterMode: boolean;
  pendingSpeech: PendingSpeech | null; // For MJ roleplay modal trigger
  activeTab: 'enquete' | 'inventaire' | 'trefles' | 'dossier';
  lastDiscoveredCardId?: string; // Trigger for modal discovery screen
}

export interface ChronologyItem {
  id: string; // 'A', 'B', 'C', 'D', 'E', 'F', 'G'
  text: string;
}
