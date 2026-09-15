import { Card } from '../types/game';

export const CARDS_DB: Record<string, Card> = {
  // --- CARTES PRINCIPALES ---
  'J_diamond': {
    id: 'J_diamond',
    suit: 'diamond',
    rank: 'J',
    type: 'main',
    requiredStage: 0,
    title: 'FIRMIN DE CARREAU',
    subtitle: 'Ancien valet de la famille Carreau',
    speaker: 'FIRMIN',
    description: `Ancien valet de la famille Carreau. Très serviable. Très stressé. Très mauvais pour raconter une histoire dans l'ordre.`
  },
  'K_diamond': {
    id: 'K_diamond',
    suit: 'diamond',
    rank: 'K',
    type: 'main',
    requiredStage: 1,
    title: 'ARMAND DE CARREAU',
    subtitle: 'Mari de Béatrice de Carreau',
    speaker: 'ARMAND',
    description: `Mari de Béatrice de Carreau. Héritier de sa fortune. Particulièrement attaché à son argent. Et à celui de sa femme...`
  },
  'Q_diamond': {
    id: 'Q_diamond',
    suit: 'diamond',
    rank: 'Q',
    type: 'main',
    requiredStage: 4,
    title: 'BÉATRICE DE CARREAU',
    subtitle: 'La Victime',
    speaker: 'BÉATRICE',
    description: `Disparue. Intelligentissime. Autoritaire. Et apparemment incapable de laisser tranquille quelqu'un qui lui volait son argent.`
  },
  'A_heart': {
    id: 'A_heart',
    suit: 'heart',
    rank: 'A',
    type: 'main',
    requiredStage: 5,
    title: 'LE FAUX CŒUR',
    subtitle: 'Preuve de la mise en scène',
    description: `Rassurez-vous. Il est faux. Enfin... Nous l'espérons. Béatrice avait donc réellement préparé une fausse scène de meurtre.`
  },
  '8_heart': {
    id: '8_heart',
    suit: 'heart',
    rank: '8',
    type: 'main',
    requiredStage: 6,
    title: 'LA CARTE PLIÉE',
    subtitle: 'Indice géométrique',
    description: `Cette carte semble avoir été conçue pour être manipulée. Pliez-la comme elle était à l'origine.`
  },
  '10_diamond': {
    id: '10_diamond',
    suit: 'diamond',
    rank: '10',
    type: 'main',
    requiredStage: 8,
    title: 'LES COMPTES',
    subtitle: 'Preuve des détournements',
    description: `Un registre de comptes montrant les montants volés au fil des ans : 2, 3, 4, 5, 6. La correspondance avec les trèfles est exacte.`
  },
  'A_spade': {
    id: 'A_spade',
    suit: 'spade',
    rank: 'A',
    type: 'main',
    requiredStage: 9,
    title: 'L\'ARME DU CRIME',
    subtitle: 'Pièce à conviction finale',
    description: `Armand affirme n'avoir jamais vu cet objet. Pourtant, son empreinte y a été retrouvée.`
  },

  // --- TRÈFLES (MONNAIE) ---
  '2_club': {
    id: '2_club',
    suit: 'club',
    rank: '2',
    type: 'currency',
    value: 2,
    title: '2 DE TRÈFLE',
    subtitle: 'Monnaie cachée (2 sous)',
    description: 'Une carte de trèfle cachée dans la maison. Vaut 2 sous.'
  },
  '3_club': {
    id: '3_club',
    suit: 'club',
    rank: '3',
    type: 'currency',
    value: 3,
    title: '3 DE TRÈFLE',
    subtitle: 'Monnaie cachée (3 sous)',
    description: 'Une carte de trèfle cachée dans la maison. Vaut 3 sous.'
  },
  '4_club': {
    id: '4_club',
    suit: 'club',
    rank: '4',
    type: 'currency',
    value: 4,
    title: '4 DE TRÈFLE',
    subtitle: 'Monnaie cachée (4 sous)',
    description: 'Une carte de trèfle cachée dans la maison. Vaut 4 sous.'
  },
  '5_club': {
    id: '5_club',
    suit: 'club',
    rank: '5',
    type: 'currency',
    value: 5,
    title: '5 DE TRÈFLE',
    subtitle: 'Monnaie cachée (5 sous)',
    description: 'Une carte de trèfle cachée dans la maison. Vaut 5 sous.'
  },
  '6_club': {
    id: '6_club',
    suit: 'club',
    rank: '6',
    type: 'currency',
    value: 6,
    title: '6 DE TRÈFLE',
    subtitle: 'Monnaie cachée (6 sous)',
    description: 'Une carte de trèfle cachée dans la maison. Vaut 6 sous.'
  },

  // --- FAUSSES PISTES ---
  '7_spade': {
    id: '7_spade',
    suit: 'spade',
    rank: '7',
    type: 'redHerring',
    title: 'EMPREINTE DE FIRMIN',
    subtitle: 'Fausse piste',
    description: 'Une empreinte de Firmin apparaît sur un élément de la mise en scène. Cela pourrait signifier qu\'il a participé au meurtre... ou qu\'il était maladroit.'
  },
  'J_heart': {
    id: 'J_heart',
    suit: 'heart',
    rank: 'J',
    type: 'redHerring',
    title: 'MESSAGE SUSPECT',
    subtitle: 'Fausse piste',
    description: '« Firmin savait où Béatrice se cachait. » Cela mérite réflexion, mais est-ce la vérité ?'
  }
};

/**
 * Helper to build card ID from suit and rank
 */
export function buildCardId(suit: Suit, rank: Rank): string {
  return `${rank}_${suit}`;
}
