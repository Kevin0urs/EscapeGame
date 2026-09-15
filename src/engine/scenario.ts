import type { GamePhase, CharacterSpeech } from './types';

// ============================================================
// CONTENU NARRATIF — LE DERNIER SERVICE
// Tout le texte du scénario est centralisé ici.
// playerLines = affiché aux joueurs directement
// characterSpeech = lu par le MJ (accessible via 5 taps logo)
// ============================================================

export interface PhaseContent {
  phase: GamePhase;
  title?: string;
  playerLines: string[];
  characterSpeech?: CharacterSpeech;
  /** Objectif/action attendue des joueurs */
  objective?: string;
  /** Sous-texte d'objectif */
  objectiveHint?: string;
}

// Contenu affiché sur la carte lors de sa découverte (CardRevealScreen)
export interface CardRevealContent {
  cardId: string;
  title: string;
  subtitle?: string;
  playerLines: string[];
}

// ============================================================
// CONTENU PAR PHASE (onglet ENQUÊTE)
// ============================================================

export const PHASE_CONTENT: Record<GamePhase, PhaseContent> = {

  intro: {
    phase: 'intro',
    title: 'CHAPITRE 1 — LE VALET',
    playerLines: [
      'La maison Carreau est silencieuse.',
      "Béatrice de Carreau a disparu.",
      "Son valet, Firmin, est introuvable.",
      "Cherchez sa carte.",
    ],
    objective: 'PREMIÈRE MISSION',
    objectiveHint: 'Retrouvez Firmin de Carreau.',
  },

  firmin_intro: {
    phase: 'firmin_intro',
    title: 'FIRMIN DE CARREAU',
    playerLines: [
      'Ancien valet de la famille Carreau.',
      'Très serviable.',
      'Très stressé.',
      "Très mauvais pour raconter une histoire dans l'ordre.",
    ],
    characterSpeech: {
      characterName: 'Firmin',
      characterEmoji: '♦',
      lines: [
        "Madame était beaucoup plus intelligente que Monsieur.",
        "Monsieur était persuadé du contraire.",
        "C'était assez amusant.",
        "Enfin, pour Madame.",
        "Pas pour Monsieur.",
        "Un soir, Madame m'a demandé de récupérer quelque chose que Monsieur cachait.",
        "Il avait une cachette très particulière.",
        "Une chaussure.",
      ],
    },
    objective: 'PROCHAINE MISSION',
    objectiveHint: "Cherchez le Roi de Carreau. Indice : là où Monsieur gardait ses chaussures.",
  },

  find_kd: {
    phase: 'find_kd',
    title: 'PROCHAINE MISSION',
    playerLines: [
      "Firmin a évoqué une cachette.",
      "Armand de Carreau cachait des choses dans ses chaussures.",
    ],
    objective: 'Trouvez le Roi de Carreau',
    objectiveHint: "Indice : là où Monsieur gardait ses chaussures.",
  },

  armand_reveal: {
    phase: 'armand_reveal',
    title: 'ARMAND DE CARREAU',
    playerLines: [
      'Mari de Béatrice de Carreau.',
      'Héritier de sa fortune.',
      'Particulièrement attaché à son argent.',
      "Et à celui de sa femme…",
    ],
    characterSpeech: {
      characterName: 'Firmin',
      characterEmoji: '♦',
      lines: [
        "Armand cachait régulièrement de l'argent dans la maison.",
        "Il paraît que ça porte bonheur…",
        "Enfin, seulement s'il y a 4 feuilles !",
        "Vous devriez chercher cet argent.",
      ],
    },
    objective: "CHAPITRE 2 — L'ARGENT",
    objectiveHint: "Armand cachait de l'argent dans toute la maison. Cherchez-le.",
  },

  currency_puzzle: {
    phase: 'currency_puzzle',
    title: "L'ARGENT D'ARMAND",
    playerLines: [
      "Armand dissimulait de l'argent dans la maison.",
      "Un argent d'un genre particulier…",
    ],
    objective: 'Avez-vous trouvé de l\'argent ?',
    objectiveHint: "Cherchez dans toute la maison.",
  },

  find_clubs: {
    phase: 'find_clubs',
    title: 'MONNAIE IDENTIFIÉE',
    playerLines: [
      "Les trèfles servent désormais de monnaie.",
      "Chaque carte de trèfle trouvée a une valeur.",
      "Il vous faut 5 trèfles pour interroger Firmin correctement.",
    ],
    objective: 'Interroger Firmin',
    objectiveHint: "Coût : 5 trèfles. Continuez à chercher les cartes de trèfle.",
  },

  firmin_testimony: {
    phase: 'firmin_testimony',
    title: 'FIRMIN TÉMOIGNE',
    playerLines: [
      "Firmin est prêt à parler.",
      "Il a accepté de révéler ce qu'il sait.",
    ],
    characterSpeech: {
      characterName: 'Firmin',
      characterEmoji: '♦',
      lines: [
        "Madame avait découvert qu'Armand lui prenait de l'argent.",
        "Pas beaucoup à chaque fois.",
        "Mais depuis longtemps.",
        "C'est impressionnant comme une petite somme devient énorme quand on la répète pendant des années.",
        "C'est un peu comme les factures.",
        "Ou les invités qui restent dormir chez vous sans apporter de petit-déjeuner.",
        "Mais je m'égare.",
        "---",
        "Madame a confronté Monsieur.",
        "Monsieur a nié.",
        "Madame n'a pas apprécié.",
        "Et après cela…",
        "Madame a commencé à avoir peur de Monsieur.",
        "---",
        "Madame avait une habitude étrange lorsqu'elle réfléchissait.",
        "Elle allait dans son jardin.",
        "Elle disait qu'elle aimait regarder ses fleurs.",
        "Pour moi, tant que ça ne se mange pas, ça ne sert à rien.",
        "Enfin c'est mon avis.",
        "Les framboises aussi ça sent bon.",
        "Sauf que ça se mange.",
        "Ça, c'est une fleur que je respecte.",
        "---",
        "Béatrice y cachait parfois des choses.",
        "Cherchez ce qu'elle vous a laissé.",
      ],
    },
    objective: 'CHAPITRE 3 — LE PIÈGE',
    objectiveHint: "Cherchez la Dame de Carreau. Indice : dans le jardin.",
  },

  find_qd: {
    phase: 'find_qd',
    title: 'PREMIÈRE CONCLUSION',
    playerLines: [
      "ARMAND VOLAIT L'ARGENT DE BÉATRICE.",
      "Béatrice l'avait découvert.",
      "Elle avait désormais une raison de se méfier de son mari.",
      "---",
      "NOUVELLE ZONE AUTORISÉE : JARDIN",
      "« Béatrice y cachait parfois des choses. »",
    ],
    objective: 'Trouvez la Dame de Carreau',
    objectiveHint: "Indice : dans le jardin.",
  },

  beatrice_reveal: {
    phase: 'beatrice_reveal',
    title: 'BÉATRICE DE CARREAU',
    playerLines: [
      'Disparue.',
      'Intelligentissime.',
      'Autoritaire.',
      "Et apparemment incapable de laisser tranquille quelqu'un qui lui volait son argent.",
    ],
    characterSpeech: {
      characterName: 'Béatrice',
      characterEmoji: '♦',
      lines: [
        "Si vous lisez ceci, c'est que vous avez trouvé ma carte.",
        "Armand me vole depuis des années.",
        "Je l'ai découvert.",
        "Je lui ai laissé une chance de tout avouer.",
        "Il a refusé.",
        "J'ai donc décidé de faire quelque chose de beaucoup plus amusant.",
        "Je vais lui faire croire que j'ai disparu.",
        "Il cherchera les preuves.",
        "Il commettra une erreur.",
        "Et je pourrai enfin le confondre.",
        "J'appelle cela un piège.",
        "Armand appelle probablement cela \"une excellente occasion de paniquer\".",
        "— Béatrice",
      ],
    },
    objective: 'DEUXIÈME CONCLUSION',
    objectiveHint: "Béatrice avait préparé un piège pour Armand.",
  },

  find_ah: {
    phase: 'find_ah',
    title: 'DEUXIÈME CONCLUSION',
    playerLines: [
      "BÉATRICE AVAIT PRÉPARÉ UN PIÈGE POUR ARMAND.",
      "---",
      "Elle voulait faire croire qu'elle avait été assassinée.",
      "Pour rendre son faux meurtre crédible, elle avait préparé une fausse preuve.",
      "---",
      "PROCHAINE PREUVE",
      "« Béatrice avait caché le cœur de son faux scénario. »",
    ],
    objective: "Trouvez l'As de Cœur",
    objectiveHint: "Indice : là où il peut être conservé au frais.",
  },

  find_8h: {
    phase: 'find_8h',
    title: 'CŒUR RÉCUPÉRÉ',
    playerLines: [
      "Rassurez-vous.",
      "Il est faux.",
      "Enfin…",
      "Nous l'espérons.",
      "---",
      "Béatrice avait donc réellement préparé une fausse scène de meurtre.",
      "Mais pourquoi cette fausse scène est-elle devenue une vraie scène de meurtre ?",
      "---",
      "Béatrice avait prévu plusieurs cachettes.",
      "Elle savait que certaines preuves ne pourraient être comprises qu'au bon moment.",
      "Trouvez la carte suivante.",
    ],
    objective: 'Trouvez le 8 de Cœur',
    objectiveHint: "Indice : « Elle n'est pas à lire. Elle est à plier. »",
  },

  bureau_puzzle: {
    phase: 'bureau_puzzle',
    title: 'CARTE PLIÉE',
    playerLines: [
      "Cette carte semble avoir été conçue pour être manipulée.",
      "Pliez-la comme elle était à l'origine.",
    ],
    objective: 'Quel lieu voyez-vous ?',
    objectiveHint: "Pliez la carte physique et observez ce que les plis rapprochent.",
  },

  find_10d: {
    phase: 'find_10d',
    title: 'CHAPITRE 4 — LA VÉRITÉ',
    playerLines: [
      "Rendez-vous dans le bureau.",
      "« Armand conservait quelque chose qu'il n'aurait jamais dû conserver. »",
    ],
    objective: 'Trouvez le 10 de Carreau',
    objectiveHint: "Indice : dans le bureau.",
  },

  comptes_reveal: {
    phase: 'comptes_reveal',
    title: 'LES COMPTES',
    playerLines: [
      "LES TRÈFLES SONT LES SOMMES VOLÉES À BÉATRICE.",
      "---",
      "Les montants correspondent exactement aux cartes de trèfle trouvées dans la maison.",
      "---",
      "Béatrice a laissé un message urgent.",
    ],
    characterSpeech: {
      characterName: 'Béatrice',
      characterEmoji: '♦',
      lines: [
        "J'ai préparé le piège.",
        "J'ai caché les preuves.",
        "Mais quelque chose vient de changer.",
        "Armand a trouvé les comptes.",
        "Il sait que j'ai découvert ce qu'il faisait.",
        "Et je crois qu'il a compris ce que je prépare.",
        "S'il comprend tout…",
        "il viendra me chercher.",
      ],
    },
    objective: 'NOUVELLE HYPOTHÈSE',
    objectiveHint: "Béatrice n'a peut-être jamais eu l'occasion de terminer son plan.",
  },

  find_as: {
    phase: 'find_as',
    title: 'NOUVELLE HYPOTHÈSE',
    playerLines: [
      "Béatrice n'a peut-être jamais eu l'occasion de terminer son plan.",
      "---",
      "DERNIÈRE PREUVE",
      "« Vous savez maintenant pourquoi Armand voulait faire disparaître Béatrice. »",
      "« Mais vous devez encore prouver qu'il l'a réellement tuée. »",
      "Cherchez l'objet lié au crime.",
    ],
    objective: "Trouvez l'As de Pique",
    objectiveHint: "Indice : là où l'on se regarde avant de quitter la maison.",
  },

  firmin_final: {
    phase: 'firmin_final',
    title: "L'ARME",
    playerLines: [
      "Armand affirme n'avoir jamais vu cet objet.",
      "Pourtant, son empreinte y a été retrouvée.",
      "---",
      "Firmin veut témoigner une dernière fois.",
    ],
    characterSpeech: {
      characterName: 'Firmin',
      characterEmoji: '♦',
      lines: [
        "Je n'ai pas tué Madame.",
        "Je l'ai aidée.",
        "Elle voulait faire croire qu'elle avait été assassinée.",
        "Tout était prévu.",
        "Mais Monsieur a découvert les comptes.",
        "Puis il a compris le reste.",
        "Il est parti chercher Madame.",
        "Et quand il est revenu…",
        "Madame était morte.",
        "Il m'a regardé.",
        "Il m'a dit de ne rien dire.",
        "Alors je n'ai rien dit.",
        "Je suis valet.",
        "Je suis là pour servir.",
        "Pas pour mourir.",
        "Enfin…",
        "pas avant l'heure du dîner.",
      ],
    },
    objective: 'CHAPITRE 5 — L\'ACCUSATION',
    objectiveHint: "Reconstituez l'histoire dans l'ordre.",
  },

  chronologie: {
    phase: 'chronologie',
    title: "RECONSTITUEZ L'HISTOIRE",
    playerLines: [
      "Vous avez toutes les pièces du puzzle.",
      "Remettez les événements dans le bon ordre.",
    ],
    objective: "Ordonnez les événements",
    objectiveHint: "Tapez les événements dans l'ordre chronologique.",
  },

  accusation: {
    phase: 'accusation',
    title: 'QUI A TUÉ BÉATRICE ?',
    playerLines: [
      "L'histoire est reconstituée.",
      "Il est temps de désigner le coupable.",
    ],
    objective: 'Désignez le coupable',
  },

  end: {
    phase: 'end',
    title: 'AFFAIRE RÉSOLUE',
    playerLines: [],
  },
};

// ============================================================
// CONTENU DES DÉCOUVERTES DE CARTES (CardRevealScreen)
// ============================================================

export const CARD_REVEAL_CONTENT: Record<string, CardRevealContent> = {
  Jd: {
    cardId: 'Jd',
    title: 'FIRMIN DE CARREAU',
    subtitle: 'Valet de la famille Carreau',
    playerLines: [
      'Ancien valet de la famille Carreau.',
      'Très serviable.',
      'Très stressé.',
      "Très mauvais pour raconter une histoire dans l'ordre.",
    ],
  },
  Kd: {
    cardId: 'Kd',
    title: 'ARMAND DE CARREAU',
    subtitle: 'Mari de Béatrice',
    playerLines: [
      'Mari de Béatrice de Carreau.',
      'Héritier de sa fortune.',
      'Particulièrement attaché à son argent.',
      "Et à celui de sa femme…",
    ],
  },
  Qd: {
    cardId: 'Qd',
    title: 'BÉATRICE DE CARREAU',
    subtitle: 'Disparue',
    playerLines: [
      'Disparue.',
      'Intelligentissime.',
      'Autoritaire.',
      "Et apparemment incapable de laisser tranquille quelqu'un qui lui volait son argent.",
    ],
  },
  Ah: {
    cardId: 'Ah',
    title: 'CŒUR RÉCUPÉRÉ',
    playerLines: [
      'Rassurez-vous.',
      'Il est faux.',
      'Enfin…',
      "Nous l'espérons.",
    ],
  },
  '8h': {
    cardId: '8h',
    title: 'CARTE PLIÉE',
    playerLines: [
      "Cette carte semble avoir été conçue pour être manipulée.",
      "Pliez-la comme elle était à l'origine.",
    ],
  },
  '10d': {
    cardId: '10d',
    title: 'LES COMPTES',
    playerLines: [
      "Armand conservait un relevé de ses… opérations.",
    ],
  },
  As: {
    cardId: 'As',
    title: "L'ARME",
    playerLines: [
      "Armand affirme n'avoir jamais vu cet objet.",
      "Pourtant, son empreinte y a été retrouvée.",
    ],
  },
  '7s': {
    cardId: '7s',
    title: "L'EMPREINTE DE FIRMIN",
    playerLines: [
      "Une empreinte de Firmin apparaît sur un élément de la mise en scène.",
      "Cela pourrait signifier qu'il a participé au meurtre.",
    ],
  },
  Jh: {
    cardId: 'Jh',
    title: 'MESSAGE',
    playerLines: [
      "« Firmin savait où Béatrice se cachait. »",
      "Cela mérite réflexion.",
    ],
  },
};

// ============================================================
// ÉVÉNEMENTS CHRONOLOGIE (puzzle final)
// ============================================================

export interface ChronologieEvent {
  id: string;
  label: string;
  correctIndex: number; // position dans la bonne séquence (0 = premier)
}

export const CHRONOLOGIE_EVENTS: ChronologieEvent[] = [
  { id: 'A', label: 'Armand vole Béatrice', correctIndex: 0 },
  { id: 'B', label: 'Béatrice découvre les détournements', correctIndex: 1 },
  { id: 'C', label: 'Béatrice prépare son faux meurtre', correctIndex: 2 },
  { id: 'D', label: 'Armand découvre le plan', correctIndex: 3 },
  { id: 'E', label: 'Armand retrouve Béatrice', correctIndex: 4 },
  { id: 'F', label: 'Armand tue Béatrice', correctIndex: 5 },
  { id: 'G', label: 'Firmin se tait', correctIndex: 6 },
];

// ============================================================
// DOSSIER — Entrées progressives
// ============================================================

export interface DossierEntry {
  id: string;
  title: string;
  content: string;
  unlockedAtPhase: GamePhase;
}

export const DOSSIER_ENTRIES: DossierEntry[] = [
  {
    id: 'victime',
    title: 'Victime',
    content: 'Béatrice de Carreau. Disparue.',
    unlockedAtPhase: 'intro',
  },
  {
    id: 'suspect',
    title: 'Suspect principal',
    content: 'Armand de Carreau. Mari. Héritier.',
    unlockedAtPhase: 'intro',
  },
  {
    id: 'temoin',
    title: 'Témoin',
    content: 'Firmin. Valet de la famille Carreau.',
    unlockedAtPhase: 'intro',
  },
  {
    id: 'vol_argent',
    title: 'Détournement de fonds',
    content: 'Armand volait régulièrement de l\'argent à Béatrice depuis des années. Béatrice l\'avait découvert.',
    unlockedAtPhase: 'find_qd',
  },
  {
    id: 'faux_meurtre',
    title: 'Faux meurtre',
    content: 'Béatrice avait préparé une mise en scène pour piéger Armand. Elle voulait lui faire croire à son assassinat.',
    unlockedAtPhase: 'find_ah',
  },
  {
    id: 'piege_beatrice',
    title: 'Plan de Béatrice',
    content: 'Béatrice avait caché des preuves dans toute la maison. Les trèfles représentent les sommes volées.',
    unlockedAtPhase: 'find_10d',
  },
  {
    id: 'comptes',
    title: 'Les comptes d\'Armand',
    content: 'Armand conservait un relevé des sommes volées. Il correspond exactement aux cartes de trèfle.',
    unlockedAtPhase: 'find_as',
  },
  {
    id: 'plan_decouvert',
    title: 'Armand découvre le plan',
    content: 'Armand a trouvé les comptes. Il a compris que Béatrice préparait quelque chose contre lui.',
    unlockedAtPhase: 'find_as',
  },
  {
    id: 'arme',
    title: "Preuve de l'arme",
    content: "L'arme du crime porte l'empreinte d'Armand. Il affirme ne pas la connaître.",
    unlockedAtPhase: 'firmin_final',
  },
  {
    id: 'firmin_silence',
    title: 'Firmin gardait le silence',
    content: 'Firmin a aidé Béatrice à préparer sa mise en scène. Après le meurtre, Armand lui a ordonné de se taire. Il a obéi.',
    unlockedAtPhase: 'chronologie',
  },
  {
    id: 'fausse_piste_7s',
    title: "Empreinte de Firmin",
    content: "Une empreinte de Firmin a été retrouvée sur la scène de crime. Fausse piste ?",
    unlockedAtPhase: 'intro',
  },
  {
    id: 'fausse_piste_jh',
    title: "Firmin savait",
    content: "Firmin savait où se cachait Béatrice. Complice ou confident ?",
    unlockedAtPhase: 'intro',
  },
];

// ============================================================
// CHAPITRES
// ============================================================

export interface Chapter {
  number: number;
  title: string;
  phases: GamePhase[];
}

export const CHAPTERS: Chapter[] = [
  {
    number: 1,
    title: 'Le valet',
    phases: ['intro', 'firmin_intro', 'find_kd'],
  },
  {
    number: 2,
    title: "L'argent",
    phases: ['armand_reveal', 'currency_puzzle', 'find_clubs', 'firmin_testimony'],
  },
  {
    number: 3,
    title: 'Le piège',
    phases: ['find_qd', 'beatrice_reveal', 'find_ah', 'find_8h', 'bureau_puzzle'],
  },
  {
    number: 4,
    title: 'La vérité',
    phases: ['find_10d', 'comptes_reveal', 'find_as', 'firmin_final'],
  },
  {
    number: 5,
    title: "L'accusation",
    phases: ['chronologie', 'accusation', 'end'],
  },
];

export function getCurrentChapter(phase: GamePhase): Chapter {
  return CHAPTERS.find((c) => c.phases.includes(phase)) ?? CHAPTERS[0];
}

// ============================================================
// TEXTE DE L'ÉCRAN FINAL
// ============================================================

export const END_SCREEN_LINES = [
  "Bravo.",
  "Vous avez découvert qu'Armand me volait.",
  "Vous avez découvert que j'avais préparé un piège.",
  "Vous avez découvert qu'il avait découvert mon plan.",
  "Et vous avez découvert qu'il m'avait retrouvée et tuée.",
  "---",
  "Firmin n'était pas coupable.",
  "Il était simplement lâche.",
  "Ce qui, dans son cas, est presque une qualité professionnelle.",
  "---",
  "Quant à Armand…",
  "Il voulait mon argent.",
  "Il l'a eu.",
  "Mais il n'a jamais compris qu'en cachant mon argent dans toute la maison,",
  "j'avais également caché de quoi le faire tomber.",
  "---",
  "J'ai donc une dernière question :",
  "Qui a été le plus intelligent ?",
  "Moi.",
  "Évidemment.",
  "Mais vous étiez pas mal non plus.",
  "---",
  "— Béatrice",
];

// ============================================================
// RÉCAPITULATIF FINAL APRÈS CHRONOLOGIE
// ============================================================

export const CHRONOLOGIE_SUMMARY = [
  "Armand volait Béatrice.",
  "Béatrice l'a découvert.",
  "Elle a préparé un faux meurtre pour le piéger.",
  "Armand a découvert son plan.",
  "Il l'a retrouvée.",
  "Il l'a réellement tuée.",
  "Firmin a gardé le silence par peur.",
];

// ============================================================
// MODE MJ — Récapitulatif d'initialisation du jeu
// (instructions pour cacher les cartes physiques)
// ============================================================

export const MJ_SETUP_GUIDE = [
  { card: 'J♦ — Firmin', location: 'Dans les chaussures d\'Armand (armoire, entrée, ou placard à chaussures)' },
  { card: 'K♦ — Armand', location: 'Dans les chaussures d\'Armand (même emplacement, ou différent)' },
  { card: 'Q♦ — Béatrice', location: 'Dans le jardin (pot de fleur, sous une pierre, dans une plante)' },
  { card: 'A♥ — Le faux cœur', location: 'Dans le réfrigérateur, le congélateur, ou une glacière' },
  { card: '8♥ — La carte pliée', location: 'Sur une table ou dans un tiroir, préalablement pliée' },
  { card: '10♦ — Les comptes', location: 'Dans le bureau (tiroir, classeur, sous le clavier)' },
  { card: 'A♠ — L\'arme', location: 'Près d\'un miroir, d\'un vestiaire, ou de l\'entrée de la maison' },
  { card: '2♣ — 2 trèfles', location: 'Caché dans la maison (sous un coussin, dans un vase…)' },
  { card: '3♣ — 3 trèfles', location: 'Caché dans la maison' },
  { card: '4♣ — 4 trèfles', location: 'Caché dans la maison' },
  { card: '5♣ — 5 trèfles', location: 'Caché dans la maison' },
  { card: '6♣ — 6 trèfles', location: 'Caché dans la maison' },
  { card: '7♠ — Fausse piste', location: 'Facilement trouvable (crée une fausse piste sur Firmin)' },
  { card: 'J♥ — Fausse piste', location: 'Facilement trouvable (suggère que Firmin connaissait la cachette)' },
];