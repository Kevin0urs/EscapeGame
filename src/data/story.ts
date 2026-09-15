import { GameStage, ChronologyItem } from '../types/game';

export interface ChapterInfo {
  number: number;
  title: string;
}

export const CHAPTERS: Record<number, ChapterInfo> = {
  0: { number: 1, title: 'Le valet' },
  1: { number: 1, title: 'Le valet' },
  2: { number: 2, title: 'L\'argent' },
  3: { number: 2, title: 'L\'argent' },
  4: { number: 2, title: 'L\'argent' },
  5: { number: 3, title: 'Le piège' },
  6: { number: 3, title: 'Le piège' },
  7: { number: 3, title: 'Le piège' },
  8: { number: 4, title: 'La vérité' },
  9: { number: 4, title: 'La vérité' },
  10: { number: 4, title: 'La vérité' },
  11: { number: 5, title: 'L\'accusation' },
  12: { number: 5, title: 'L\'accusation' },
};

export interface StageGoal {
  title: string;
  description: string;
  hintLevel1: string;
  hintLevel2: string;
  solution: string;
}

export const STAGE_GOALS: Record<GameStage, StageGoal> = {
  0: {
    title: 'PREMIÈRE MISSION',
    description: 'Retrouvez Firmin (Valet de Carreau — J♦).',
    hintLevel1: 'Le premier suspect / témoin est un valet.',
    hintLevel2: 'Cherchez la carte du Valet de Carreau (J♦).',
    solution: 'Validez la carte J♦ dans l\'application.'
  },
  1: {
    title: 'PROCHAINE MISSION',
    description: 'Cherchez le Roi de Carreau (K♦).\nIndice : Là où Monsieur gardait ses chaussures.',
    hintLevel1: 'Firmin a mentionné la cachette particulière d\'Armand.',
    hintLevel2: 'Inspectez les chaussures de la maison.',
    solution: 'Validez la carte K♦.'
  },
  2: {
    title: 'IDENTIFICATION DE LA MONNAIE',
    description: 'Armand cachait régulièrement de l\'argent dans la maison. Identifiez le nom de cette monnaie.',
    hintLevel1: 'Quel symbole végétal porte bonheur à 4 feuilles ?',
    hintLevel2: 'C\'est l\'une des 4 familles de cartes à jouer.',
    solution: 'Tapez "Trèfle".'
  },
  3: {
    title: 'INTERROGER FIRMIN',
    description: 'Firmin parlera davantage si vous le payez.\nCoût : 5 trèfles (5♣).',
    hintLevel1: 'Cherchez les cartes de trèfle cachées dans la maison (2♣, 3♣, 4♣, 5♣, 6♣).',
    hintLevel2: 'Chaque carte de trèfle ajoute sa valeur à votre portefeuille.',
    solution: 'Rassemblez au moins 5 trèfles dans votre solde puis validez le paiement.'
  },
  4: {
    title: 'NOUVELLE ZONE : LE JARDIN',
    description: 'Béatrice allait dans son jardin pour réfléchir.\nCherchez la Dame de Carreau (Q♦).',
    hintLevel1: 'Inspectez les plantes ou fleurs du jardin.',
    hintLevel2: 'Recherchez la carte de Béatrice de Carreau (Q♦).',
    solution: 'Validez la carte Q♦.'
  },
  5: {
    title: 'PROCHAINE PREUVE',
    description: 'Béatrice avait caché le cœur de son faux scénario.\nIndice : Cherchez-le là où il peut être conservé au frais.',
    hintLevel1: 'Où garde-t-on les aliments au frais dans une maison ?',
    hintLevel2: 'Inspectez le réfrigérateur ou le bac à glaçons.',
    solution: 'Validez l\'As de Cœur (A♥).'
  },
  6: {
    title: 'LA CARTE À MANIPULER',
    description: 'Trouvez la carte suivante.\nIndice : « Elle n\'est pas à lire. Elle est à plier. »',
    hintLevel1: 'Cherchez une carte de cœur comportant le chiffre 8.',
    hintLevel2: 'Recherchez le 8 de Cœur (8♥).',
    solution: 'Validez le 8♥.'
  },
  7: {
    title: 'DÉCRYPTAGE DU PLIAGE',
    description: 'Pliez la carte 8♥ comme elle était à l\'origine et identifiez le lieu révélé.',
    hintLevel1: 'Rapprochez les plis imprimés sur la carte physique.',
    hintLevel2: 'Les lettres formées désignent un lieu de travail ou de rangement.',
    solution: 'Tapez "BUREAU".'
  },
  8: {
    title: 'RECHERCHE DANS LE BUREAU',
    description: 'Rendez-vous dans le bureau.\n« Armand conservait quelque chose qu\'il n\'aurait jamais dû conserver. »',
    hintLevel1: 'Cherchez un document ou registre de comptes dans le bureau.',
    hintLevel2: 'Recherchez la carte 10 de Carreau (10♦).',
    solution: 'Validez le 10♦.'
  },
  9: {
    title: 'DERNIÈRE PREUVE',
    description: 'Cherchez l\'objet lié au crime.\nIndice : Là où l\'on se regarde avant de quitter la maison.',
    hintLevel1: 'Où se regarde-t-on avant de sortir ?',
    hintLevel2: 'Inspectez l\'entrée, le hall ou les miroirs près de la porte.',
    solution: 'Validez l\'As de Pique (A♠).'
  },
  10: {
    title: 'RECONSTITUTION HISTORIQUE',
    description: 'Reconstituez la chronologie exacte des événements de l\'histoire.',
    hintLevel1: 'Commencez par le premier méfait d\'Armand.',
    hintLevel2: 'L\'ordre chronologique logique est A → B → C → D → E → F → G.',
    solution: 'Placez les événements dans l\'ordre chronologique exact.'
  },
  11: {
    title: 'ACCUSATION FINALE',
    description: 'Désignez le véritable coupable du meurtre de Béatrice.',
    hintLevel1: 'Qui avait le plus grand mobile après la découverte des comptes ?',
    hintLevel2: 'Firmin était lâche, Béatrice piégée, mais qui l\'a tuée ?',
    solution: 'Sélectionnez "ARMAND".'
  },
  12: {
    title: 'AFFAIRE RÉSOLUE',
    description: 'L\'enquête est terminée. Écoutez le mot de la fin de Béatrice de Carreau.',
    hintLevel1: 'Félicitations !',
    hintLevel2: 'Vous avez résolu l\'enquête.',
    solution: 'Aucune.'
  }
};

// Chronology Puzzle Items (No letters 'A' or 'B' displayed on screen as per comment #3)
export const CHRONOLOGY_ITEMS: ChronologyItem[] = [
  { id: 'A', text: 'Armand volait régulièrement l\'argent de Béatrice.' },
  { id: 'B', text: 'Béatrice a découvert les détournements de son mari.' },
  { id: 'C', text: 'Béatrice a préparé une fausse scène de meurtre pour le piéger.' },
  { id: 'D', text: 'Armand a découvert le registre des comptes et le plan de sa femme.' },
  { id: 'E', text: 'Armand a retrouvé la cachette de Béatrice.' },
  { id: 'F', text: 'Armand a réellement tué Béatrice.' },
  { id: 'G', text: 'Firmin a gardé le silence par peur de son maître.' },
];

export const CORRECT_CHRONOLOGY_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// Speech contents for MJ roleplaying mode (Comment #4)
export const SPEECHES = {
  FIRMIN_1: {
    speaker: 'FIRMIN DE CARREAU',
    title: 'PREMIER TÉMOIGNAGE DE FIRMIN',
    text: `« Madame était beaucoup plus intelligente que Monsieur. Monsieur était persuadé du contraire. C'était assez amusant. Enfin, pour Madame. Pas pour Monsieur.\n\nUn soir, Madame m'a demandé de récupérer quelque chose que Monsieur cachait. Il avait une cachette très particulière.\n\nUne chaussure. »`
  },
  ARMAND_1: {
    speaker: 'FIRMIN (AU SUJET D\'ARMAND)',
    title: 'RÉVÉLATION DE LA CACHETTE',
    text: `« Armand cachait régulièrement de l'argent dans la maison. Il parait que ça porte bonheur... Enfin, seulement s'il y a 4 feuilles ! Vous devriez chercher cet argent. »`
  },
  FIRMIN_PAID: {
    speaker: 'FIRMIN DE CARREAU',
    title: 'TÉMOIGNAGE EXTENDU DE FIRMIN',
    text: `« Madame avait découvert qu'Armand lui prenait de l'argent. Pas beaucoup à chaque fois. Mais depuis longtemps. C'est impressionnant comme une petite somme devient énorme quand on la répète pendant des années. C'est un peu comme les factures. Ou les invités qui restent dormir chez vous sans apporter de petit-déjeuner. Mais je m'égare.\n\nMadame a confronté Monsieur. Monsieur a nié. Madame n'a pas apprécié. Et après cela... Madame a commencé à avoir peur de Monsieur.\n\nMadame avait une habitude étrange lorsqu'elle réfléchissait. Elle allait dans son jardin. Elle disait qu'elle aimait regarder ses fleurs. Pour moi, tant que ça ne se mange pas, ça ne sert à rien. Enfin c'est mon avis. Les framboises aussi ça sent bon. Sauf que ça se mange. Ça, c'est une fleur que je respecte. »`
  },
  BEATRICE_LETTER: {
    speaker: 'BÉATRICE DE CARREAU',
    title: 'LA LETTRE DE BÉATRICE',
    text: `« Si vous lisez ceci, c'est que vous avez trouvé ma carte.\n\nArmand me vole depuis des années. Je l'ai découvert. Je lui ai laissé une chance de tout avouer. Il a refusé. J'ai donc décidé de faire quelque chose de beaucoup plus amusant.\n\nJe vais lui faire croire que j'ai disparu. Il cherchera les preuves. Il commettra une erreur. Et je pourrai enfin le confondre.\n\nJ'appelle cela un piège. Armand appelle probablement cela "une excellente occasion de paniquer".\n\n— Béatrice »`
  },
  COMPTES_NOTE: {
    speaker: 'NOTE DE BÉATRICE',
    title: 'NOTE DANGER DANS LES COMPTES',
    text: `« J'ai préparé le piège. J'ai caché les preuves. Mais quelque chose vient de changer.\n\nArmand a trouvé les comptes. Il sait que j'ai découvert ce qu'il faisait. Et je crois qu'il a compris ce que je prépare.\n\nS'il comprend tout... il viendra me chercher. »`
  },
  FIRMIN_FINAL: {
    speaker: 'FIRMIN DE CARREAU',
    title: 'TÉMOIGNAGE FINAL DE FIRMIN',
    text: `« Je n'ai pas tué Madame. Je l'ai aidée. Elle voulait faire croire qu'elle avait été assassinée. Tout était prévu. Mais Monsieur a découvert les comptes. Puis il a compris le reste. Il est parti chercher Madame. Et quand il est revenu... Madame était morte.\n\nIl m'a regardé. Il m'a dit de ne rien dire. Alors je n'ai rien dit. Je suis valet. Je suis là pour servir. Pas pour mourir. Enfin... pas avant l'heure du dîner. »`
  },
  BEATRICE_FINAL: {
    speaker: 'BÉATRICE DE CARREAU',
    title: 'MOT DE LA FIN DE BÉATRICE',
    text: `« Bravo.\n\nVous avez découvert qu'Armand me volait.\nVous avez découvert que j'avais préparé un piège.\nVous avez découvert qu'il avait découvert mon plan.\nEt vous avez découvert qu'il m'avait retrouvée et tuée.\n\nFirmin n'était pas coupable. Il était simplement lâche. Ce qui, dans son cas, est presque une qualité professionnelle.\n\nQuant à Armand... Il voulait mon argent. Il l'a eu. Mais il n'a jamais compris qu'en cachant mon argent dans toute la maison, j'avais également caché de quoi le faire tomber.\n\nJ'ai donc une dernière question :\nQui a été le plus intelligent ?\n\nMoi. Évidemment.\n\nMais vous étiez pas mal non plus.\n\n— Béatrice »`
  }
};
