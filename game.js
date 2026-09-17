// =============================================================
// LE DERNIER SERVICE — game.js (Part 1: Data)
// =============================================================

const SUITS = {
  diamond: { symbol: '\u2666', name: 'Carreaux', color: 'red' },
  heart:   { symbol: '\u2665', name: 'Coeurs',   color: 'red' },
  spade:   { symbol: '\u2660', name: 'Piques',   color: 'black' },
  club:    { symbol: '\u2663', name: 'Trefles',  color: 'black' },
};

const CARDS = {
  Jd:   { suit:'diamond', rank:'J',  type:'main',     label:'Firmin',        requiredPhase:'intro',    revealPhase:'firmin_intro' },
  Kd:   { suit:'diamond', rank:'K',  type:'main',     label:'Armand',        requiredPhase:'find_kd',  revealPhase:'armand_reveal' },
  Qd:   { suit:'diamond', rank:'Q',  type:'main',     label:'Beatrice',      requiredPhase:'find_qd',  revealPhase:'beatrice_reveal' },
  Ah:   { suit:'heart',   rank:'A',  type:'main',     label:'Faux coeur',    requiredPhase:'find_ah',  revealPhase:'find_8h' },
  '8h': { suit:'heart',   rank:'8',  type:'main',     label:'Carte pliee',   requiredPhase:'find_8h',  revealPhase:'bureau_puzzle' },
  '10d':{ suit:'diamond', rank:'10', type:'main',     label:'Comptes',       requiredPhase:'find_10d', revealPhase:'comptes_reveal' },
  As:   { suit:'spade',   rank:'A',  type:'main',     label:"L'arme",        requiredPhase:'find_as',  revealPhase:'firmin_final' },
  '2c': { suit:'club', rank:'2', type:'currency', value:2 },
  '3c': { suit:'club', rank:'3', type:'currency', value:3 },
  '4c': { suit:'club', rank:'4', type:'currency', value:4 },
  '5c': { suit:'club', rank:'5', type:'currency', value:5 },
  '6c': { suit:'club', rank:'6', type:'currency', value:6 },
  '7s': { suit:'spade', rank:'7', type:'redHerring', label:'Empreinte' },
  Jh:   { suit:'heart',  rank:'J', type:'redHerring', label:'Message' },
};

const PHASE_ORDER = [
  'intro','firmin_intro','find_kd','armand_reveal','currency_puzzle',
  'find_clubs','firmin_testimony','find_qd','beatrice_reveal','find_ah',
  'find_8h','bureau_puzzle','find_10d','comptes_reveal','find_as',
  'firmin_final','chronologie','accusation','end'
];

const CHAPTERS = {
  intro:{n:1,t:'Une soirée ordinaire'}, firmin_intro:{n:1,t:'Une soirée ordinaire'},
  find_kd:{n:1,t:'Une soirée ordinaire'}, armand_reveal:{n:2,t:'Le maître des lieux'},
  currency_puzzle:{n:2,t:'Le maître des lieux'}, find_clubs:{n:2,t:'Le maître des lieux'},
  firmin_testimony:{n:2,t:'Le maître des lieux'}, find_qd:{n:3,t:'Madame DE CARREAU'},
  beatrice_reveal:{n:3,t:'Madame DE CARREAU'}, find_ah:{n:3,t:'Madame DE CARREAU'},
  find_8h:{n:3,t:'Madame DE CARREAU'}, bureau_puzzle:{n:4,t:'Ce que cache le bureau'},
  find_10d:{n:4,t:'Ce que cache le bureau'}, comptes_reveal:{n:4,t:'Ce que cache le bureau'},
  find_as:{n:4,t:'Ce que cache le bureau'}, firmin_final:{n:5,t:'La vérité'},
  chronologie:{n:5,t:'La vérité'}, accusation:{n:5,t:'La vérité'}, end:{n:5,t:'Épilogue'},
};

const PC = {}; // PHASE_CONTENT — rempli dans part2
const CARD_REVEAL = {}; // rempli dans part2
const CHRONO_EVENTS = [
  {id:'A',label:"Armand détourne l'héritage de la mère de Béatrice",correct:0},
  {id:'B',label:"Béatrice découvre les documents compromettants",correct:1},
  {id:'C',label:"Début du chantage : Béatrice exige des pièces à trèfle",correct:2},
  {id:'D',label:"Armand paie en silence pendant cinq ans",correct:3},
  {id:'E',label:"Armand propose à Béatrice un accord final dans le bureau",correct:4},
  {id:'F',label:"Béatrice se rend dans le bureau, seule",correct:5},
  {id:'G',label:"Firmin entend la porte du bureau puis le silence",correct:6},
];

const DOSSIER = [
  {id:'victime',  k:'Béatrice',             v:"Bonne de maison depuis 20 ans. Absente ce soir. Héritière lésée.", phase:'intro'},
  {id:'suspect1', k:'Armand de Carreau',    v:"Maître des lieux. Nie savoir où est Béatrice. Nerveux.", phase:'intro'},
  {id:'temoin',   k:'Firmin',               v:"Cuisinier. A vu Béatrice partir de force. Témoignage monnayable.", phase:'firmin_intro'},
  {id:'heritage', k:'La succession',        v:"Armand a détourné l'héritage de la mère de Béatrice il y a 20 ans.", phase:'firmin_testimony'},
  {id:'chantage', k:'Le chantage',          v:"Béatrice faisait chanter Armand depuis 5 ans. Les trèfles = les paiements.", phase:'firmin_testimony'},
  {id:'jardin',   k:'Le jardin',            v:"Firmin y a envoyé les enquêteurs. Une carte y était cachée.", phase:'find_qd'},
  {id:'lettre',   k:"La lettre de Béatrice",v:"Écrite précipitamment. Elle savait qu'elle était en danger.", phase:'beatrice_reveal'},
  {id:'pliage',   k:'La carte pliée',       v:"Révèle le mot BUREAU quand on la plie correctement.", phase:'bureau_puzzle'},
  {id:'comptes',  k:"Le relevé d'Armand",   v:"5 ans de paiements soigneusement documentés. Preuve du chantage.", phase:'comptes_reveal'},
  {id:'accord',   k:"L'accord final",       v:"Armand a convoqué Béatrice dans le bureau ce soir pour un accord.", phase:'comptes_reveal'},
  {id:'as',       k:"L'as de pique",        v:"Trouvé dans la maison. Firmin l'a vu dans la poche d'Armand ce soir.", phase:'firmin_final'},
  {id:'fp7s', k:'Empreinte — fausse piste', v:"L'empreinte sur le 7 de pique ne correspond à aucun suspect.", phase:'never', rh:'7s'},
  {id:'fpJh', k:'Message anonyme — fausse piste', v:"Le message sur le valet de coeur reste non élucidé.", phase:'never', rh:'Jh'},
];

const END_LINES = [
  "Armand de Carreau a été conduit au poste de gendarmerie le lendemain matin.",
  "---",
  "Dans le bureau, derrière un panneau coulissant, on a retrouvé Béatrice.",
  "Elle était vivante. À peine.",
  "---",
  "Armand l'avait enfermée, comptant la faire disparaître dans la nuit.",
  "Vos découvertes ont tout changé.",
  "---",
  "Béatrice a pu témoigner. Armand a tout avoué.",
  "---",
  "Vingt ans de mensonges. Cinq ans de chantage.",
  "Et une nuit pour que la vérité éclate.",
  "---",
  "Merci à vous.",
  "— Béatrice de Carreau",
];

const SETUP = [
  {c:'J\u2666 Valet de Carreau', l:'Dans le salon, posé en évidence (table basse, cheminée).'},
  {c:'K\u2666 Roi de Carreau',   l:"Dans la chambre d'Armand, sur le bureau ou dans un tiroir."},
  {c:'Q\u2666 Dame de Carreau',  l:'Dans le jardin (pot de fleur, sous une pierre, près d\'un rosier).'},
  {c:'A\u2665 As de Coeur',      l:'Dans la cuisine ou près d\'un vase brisé.'},
  {c:'8\u2665 Huit de Coeur',    l:'Sur une table, pré-pliée pour que le mot BUREAU apparaisse.'},
  {c:'10\u2666 Dix de Carreau',  l:'Dans le bureau, sur le sous-main ou dans un classeur.'},
  {c:'A\u2660 As de Pique',      l:'Dans un couloir ou près d\'une entrée.'},
  {c:'2\u2663 à 6\u2663 Trèfles',l:'Cachés partout : sous des vases, derrière des livres, dans des chaussures.'},
  {c:'7\u2660 Sept de Pique',    l:'Facilement visible — fausse piste intentionnelle.'},
  {c:'J\u2665 Valet de Coeur',   l:'Facilement visible — fausse piste intentionnelle.'},
];
// =============================================================
// CONTENU NARRATIF (PC + CARD_REVEAL)
// =============================================================

PC.intro = {
  title:'Dossier Carreau',
  lines:[
    "Vous arrivez dans un ancien manoir alors que la nuit commence déjà à tomber.",
    "Une soirée calme, fraîche, presque ordinaire.",
    "Sur la table du salon vous attend un dossier que personne ne semble vouloir ouvrir.",
    "<strong>DOSSIER CARREAU</strong>",
    "— Affaire non résolue.<br>— Victime présumée : Béatrice DE CARREAU<br>— Dernier employé connu : Firmin, le valet des DE CARREAU",
  ],
  obj:"PREMIÈRE MISSION — Retrouvez Firmin, le Valet de la famille. Il est quelque part dans cette pièce !",
  mj:null
};
PC.firmin_intro = {
  title:'Firmin, Valet des DE CARREAU',
  lines:["Firmin vous regarde. Il attend."],
  obj:'Allez voir le Maître du Jeu.',
  mj:{name:'Firmin',emoji:'🤵',lines:[
    "Ah ! Vous voilà enfin.",
    "Je suis Firmin, le valet des DE CARREAU. ",
    "Enfin je fue, mainenant je suis son fantôme...",
    "Rassurez vous, je suis le seul ici.",
    "---",
    "Vous savez, Dame DE CARREAU était beaucoup plus intelligente que Monsieur.",
    "Monsieur était persuadé du contraire.",
    "C'était assez amusant.",
    "Enfin, pour Madame. Pas pour Monsieur.",
    "---",
    "Un soir, Madame m'a demandé de récupérer quelque chose que Monsieur cachait.",
    "Et je savais où il avait l'habitude de cacher ses affaires.",
    "Dans ses chaussures.",
    "Enfin… pas toutes ses affaires.",
    "**Mais suffisamment pour que ça vaille le coup de regarder.**",
  ]}
};
PC.find_kd = {
  title:'Prochaine mission',
  lines:["Firmin vous a glissé un regard complice. Il sait quelque chose..."],
  obj:"PROCHAINE MISSION — Retrouvez les affaires du Monsieur DE CARREAU !",
  mj:null
};
PC.armand_reveal = {
  title:'Armand DE CARREAU',
    lines: ["Firmin semble avoir quelque chose à dire."],
  obj:'Allez voir le Maître du Jeu.',
  mj:{name:'Firmin',emoji:'🤵',lines:[
    "Ah… Vous avez trouvé deux trèfles de Madame DE CARREAU.",
    "Enfin… de Monsieur DE CARREAU... théoriquement",
    "Il ne pensait pas que quelqu'un regarderait ici.",
    "---",
    "Enfin, peu importe. Trouvez en plus, Trouvez les tous, les 20 !",
  ]}
};
PC.currency_puzzle = {
  title:"L'argent caché",
  lines:["En fouillant, vous allez peut-être tomber sur des sous dissimulés dans des endroits incongrus !"],
  obj:"Avez-vous trouvé de l'argent dans la maison ?",
  mj:null
};
PC.find_clubs = {
  title:'Les trèfles de la maison',
  lines:["Ces trèfles sont la monnaie que Firmin accepte. Son témoignage a un prix.","Continuez à chercher dans toute la maison."],
  obj:'Rassemblez des trèfles, puis payez Firmin pour son témoignage.',
  mj:null
};
PC.firmin_testimony = {
  title:'Ce que sait Firmin',
  lines:["Firmin soupèse l'argent dans sa main. Il vous regarde. Il se décide."],
  obj:'Allez voir le Maître du Jeu.',
  mj:{name:'Firmin',emoji:'🤵',lines:[
    "Madame avait découvert qu'Armand lui prenait de l'argent.",
    "Pas beaucoup à chaque fois.",
    "Mais depuis longtemps.", "---",
    "C'est impressionnant comme une petite quantité devient énorme quand on la répète pendant des années.",
    "C'est comme les moustiques, la quantité de sang qu'ils ont dû me prendre ceux-là !", "---",
    "Mais je m'égare.",
    "Madame adorait les fleurs. Elle passait beaucoup de temps dans le jardin",
    "Moi, je n'ai jamais vraiment compris.",
    "Pour moi, si ça ne se mange pas, ça ne sert à rien.",
    "Les framboises aussi ça sent bon, mais surtout ça se mange.",
    "Voilà une fleur que je respecte.",
  ]}
};
PC.find_qd = {
  title:'Madame DE CARREAU',
  lines:["Frimin vous a donné des informations, c'etait cher payé, mais il y avait des éléments intéressants..."],
  obj:'Retrouvez Beatrice de CARREAU !',
  mj:null
};
PC.beatrice_reveal = {
  title:'La Dame DE CARREAU',
  lines:["Une dame de carreau. Mais c'est la lettre au dos qui vous arrête, griffonnée à la hâte."],
  obj:'',
  mj:null
};
PC.find_ah = {
  title:'La piste du bureau',
  lines:["La lettre de Béatrice vous glace. Il faut trouver ce qui s'est passé dans ce bureau.","D'abord, quelque chose attire votre attention ailleurs dans la maison."],
  obj:'Cherchez dans la maison — une carte rouge vous attend.',
  mj:null
};
PC.find_8h = {
  title:'La carte pliée',
  lines:["Un as de cœur, presque ordinaire. Mais une autre carte, à côté, semble avoir été pliée et repliée de nombreuses fois. Comme si on voulait qu'elle révèle quelque chose."],
  obj:'Trouvez la carte pliée et manipulez-la.',
  mj:null
};
PC.bureau_puzzle = {
  title:'Le message du pliage',
  lines:["La carte pliée. En la manipulant, quelque chose apparaît. Les plis rapprochent certaines lettres, certains mots."],
  obj:"Pliez la carte comme elle était à l'origine. Quel lieu révèle-t-elle ?",
  mj:null
};
PC.find_10d = {
  title:"Le bureau d'Armand",
  lines:["Le bureau. Armand le fermait toujours à clé. Ce soir, la porte est entrouverte.","Sur le sous-main, bien en évidence, une carte."],
  obj:'Trouvez la carte dans le bureau.',
  mj:null
};
PC.comptes_reveal = {
  title:'Les comptes',
  lines:["Un dix de carreau. Et au dos, un relevé minutieux : les sommes versées à Béatrice, année par année.","Armand conservait les preuves. Pour quoi faire ?"],
  obj:'Allez voir le Maître du Jeu.',
  mj:{name:'Armand',emoji:'🎩',lines:[
    "Vous avez tout trouvé, à ce que je vois.","---",
    "Oui. Béatrice me faisait chanter. J'ai payé. Pendant cinq ans, j'ai payé.",
    "Ce soir, je lui ai proposé un accord final. Elle viendrait dans le bureau. Je lui donnerais tout ce que je lui devais.","---",
    "Mais elle n'est pas venue. Elle a pris peur et elle est partie.",
    "**Je ne sais pas où elle est. Je vous le jure.**"
  ]}
};
PC.find_as = {
  title:'La dernière pièce',
  lines:["Armand ment. Il manque encore quelque chose. Une preuve. Une arme peut-être.","Cherchez. Elle est quelque part dans cette maison."],
  obj:'Trouvez la dernière carte.',
  mj:null
};
PC.firmin_final = {
  title:'Le témoignage final',
  lines:["Un as de pique. Froid. Définitif.","Firmin vous voit rapporter la carte. Son visage se décompose."],
  obj:'Allez voir le Maître du Jeu.',
  mj:{name:'Firmin',emoji:'🤵',lines:[
    "Je… j'aurais dû parler plus tôt.","---",
    "J'étais dans le couloir. J'ai entendu. La porte du bureau. Des voix. Puis plus rien.",
    "Et M. Armand qui ressortait seul. Avec cette carte dans la poche.","---",
    "Béatrice n'est pas partie. Elle ne partira plus jamais.",
    "**Ce soir, M. Armand a mis fin à vingt ans de secrets.**"
  ]}
};
PC.chronologie = {title:'Reconstituez les faits',lines:["Vous rassemblez tout ce que vous savez."],obj:'Reconstituez la chronologie des événements.',mj:null};
PC.accusation = {title:'Qui a tué Béatrice ?',lines:["Le moment est venu. Vous avez toutes les pièces du puzzle."],obj:'Désignez le coupable.',mj:null};
PC.end = {title:'Épilogue',lines:[],obj:'',mj:null};

CARD_REVEAL.Jd   = {title:'FIRMIN, VALET DES CARREAU', lines:[
  "Ancien valet de la famille Carreau.",
  "Très serviable.",
  "Très stressé.",
  "Très mauvais pour raconter une histoire dans l'ordre.",
  "<em>Il parle peu sauf si on le paie…</em>",
]};
CARD_REVEAL.Kd   = {title:'ARMAND DE CARREAU', lines:[
  "Mari de Béatrice DE CARREAU.",
  "Très attaché à l'argent.",
  "<em>Encore plus attaché à l'argent des autres.</em>",
]};
CARD_REVEAL.Qd   = {title:'La lettre de Béatrice',  lines:["Elle savait qu'elle était en danger. Elle a quand même avancé."]};
CARD_REVEAL.Ah   = {title:'Un coeur sans vie',       lines:["L'as de coeur, planté dans un vase brisé. Un symbole ou une menace."]};
CARD_REVEAL['8h']= {title:'La carte aux mille plis', lines:["Quelqu'un a plié cette carte avec soin. Pour qu'elle dise ce qu'elle devait taire."]};
CARD_REVEAL['10d']={title:'Cinq années de silence',  lines:["Armand a tout consigné. Les dates. Les montants. Comme s'il voulait être prêt pour un procès."]};
CARD_REVEAL.As   = {title:"L'arme de la vérité",     lines:["L'as de pique. Firmin le reconnaît. Il était dans la poche d'Armand ce soir-là."]};
CARD_REVEAL['2c']= {title:'Deux trèfles',  lines:["Une pièce à l'effigie d'un trèfle. Valeur : 2."]};
CARD_REVEAL['3c']= {title:'Trois trèfles', lines:["Trois pièces à trèfle. Valeur : 3."]};
CARD_REVEAL['4c']= {title:'Quatre trèfles',lines:["Une petite liasse. Valeur : 4."]};
CARD_REVEAL['5c']= {title:'Cinq trèfles', lines:["Un lot soigneusement emballé. Valeur : 5."]};
CARD_REVEAL['6c']= {title:'Six trèfles',  lines:["La plus grande trouvaille. Valeur : 6."]};
CARD_REVEAL['7s']= {title:'Empreinte suspecte', lines:["Un sept de pique avec une empreinte digitale partielle.","Elle ne correspond à personne dans la maison.","<em>Fausse piste.</em>"]};
CARD_REVEAL.Jh   = {title:'Un message anonyme', lines:["Un valet de coeur avec des mots écrits à l'encre rouge.","Les initiales ne correspondent à aucun suspect.","<em>Fausse piste.</em>"]};

// =============================================================
// ETAT DU JEU + SAUVEGARDE
// =============================================================

function defaultGame() {
  return {phase:'intro',discovered:[],early:[],clubs:[],spent:0,solved:[],
    gardenOpen:false,bureauOpen:false,walletVisible:false,currencyId:false,mjDone:false};
}

let G = (function(){
  try { const r=localStorage.getItem('lds_v2'); if(!r) return defaultGame();
    const g=JSON.parse(r); return g.phase?g:defaultGame();
  } catch(e){ return defaultGame(); }
})();

function saveGame(){ G.lastSaved=new Date().toISOString(); localStorage.setItem('lds_v2',JSON.stringify(G)); }
function resetGame(){ localStorage.removeItem('lds_v2'); G=defaultGame(); }
function clubBalance(){ const v={'2c':2,'3c':3,'4c':4,'5c':5,'6c':6}; return G.clubs.reduce((s,id)=>s+(v[id]||0),0)-G.spent; }
function phaseIdx(p){ return PHASE_ORDER.indexOf(p); }
function hasMJSpeech(){ return PC[G.phase]&&PC[G.phase].mj&&!G.mjDone; }
function getExpectedCard(){
  const m={intro:'J\u2666',find_kd:'K\u2666',find_qd:'Q\u2666',find_ah:'A\u2665',find_8h:'8\u2665',find_10d:'10\u2666',find_as:'A\u2660'};
  return m[G.phase]||null;
}

// =============================================================
// LOGIQUE DE PROGRESSION
// =============================================================

function discoverCard(cardId) {
  const card = CARDS[cardId];
  if (!card) return {type:'not_found'};

  if (card.type === 'currency') {
    if (G.clubs.includes(cardId)) return {type:'already_found'};
    G.clubs.push(cardId);
    // Avant l'étape monnaie : message neutre, pas de révélation portefeuille
    const beforeCurrency = phaseIdx(G.phase) < phaseIdx('currency_puzzle');
    if (!beforeCurrency) G.walletVisible = true;
    saveGame();
    if (beforeCurrency) return {type:'currency_early', cardId, value:card.value};
    return {type:'currency', cardId, value:card.value, balance:clubBalance()};
  }
  if (card.type === 'redHerring') {
    if (G.discovered.includes(cardId)) return {type:'already_found'};
    G.discovered.push(cardId); saveGame();
    return {type:'red_herring', cardId};
  }

  if (G.discovered.includes(cardId)) return {type:'already_found'};
  const required = phaseIdx(card.requiredPhase);
  const current  = phaseIdx(G.phase);
  if (current < required) {
    if (!G.early.includes(cardId)) G.early.push(cardId);
    saveGame(); return {type:'early', cardId};
  }

  G.discovered.push(cardId);
  G.phase = card.revealPhase;
  G.mjDone = false;
  if (phaseIdx(G.phase) >= phaseIdx('find_qd')) G.gardenOpen = true;
  if (phaseIdx(G.phase) >= phaseIdx('bureau_puzzle')) G.bureauOpen = true;
  if (cardId === 'Kd') {
    G.walletVisible = true;
  }
  saveGame(); checkEarlyCards();
  return {type:'main', cardId};
}

function checkEarlyCards() {
  for (const cid of [...G.early]) {
    const card = CARDS[cid]; if (!card) continue;
    if (phaseIdx(G.phase) >= phaseIdx(card.requiredPhase)) {
      G.early = G.early.filter(x=>x!==cid);
      G.discovered.push(cid);
      G.phase = card.revealPhase;
      G.mjDone = false; saveGame();
    }
  }
}

function completeMJSpeech() {
  G.mjDone = true;
  const nxt = {firmin_intro:'find_kd',armand_reveal:'currency_puzzle',firmin_testimony:'find_qd',
    beatrice_reveal:'find_ah',comptes_reveal:'find_as',firmin_final:'chronologie'};
  if (nxt[G.phase]) { G.phase = nxt[G.phase]; if (G.phase==='find_qd') G.gardenOpen=true; }
  saveGame();
}

function solveCurrencyPuzzle() { G.currencyId=true; G.walletVisible=true; G.phase='find_clubs'; saveGame(); }
function payFirmin() {
  if (clubBalance()<20) return false;
  G.spent+=20; G.phase='firmin_testimony'; G.mjDone=false; saveGame(); return true;
}
function solveBureau() { G.bureauOpen=true; G.phase='find_10d'; G.solved.push('bureau'); saveGame(); }
function solveChronologie() { G.phase='accusation'; G.solved.push('chrono'); saveGame(); }
function solveAccusation() { G.phase='end'; G.solved.push('accusation'); saveGame(); }

// =============================================================
// VARIABLES UI
// =============================================================

let currentTab = 'enquete';
let showBeatriceLetter = false;
let logoTaps = 0, logoTimer = null;
let selectedSuit = null, selectedRank = null;
let chronoAnswer = [], shuffledChrono = [];

// =============================================================
// RENDU PRINCIPAL
// =============================================================

function render() {
  if (G.phase==='end') { showEndScreen(); return; }
  updateChapterBar(); updateWallet(); updateNavTabs(); renderTab();
}

function updateChapterBar() {
  const ch = CHAPTERS[G.phase]||{n:1,t:'...'};
  document.getElementById('chap-num').textContent = 'CH. '+ch.n;
  document.getElementById('chap-name').textContent = ch.t;
}

function updateWallet() {
  const wb = document.getElementById('wallet-badge');
  if (G.walletVisible) { wb.textContent='\u2663 '+clubBalance(); wb.classList.remove('hidden'); }
  else wb.classList.add('hidden');
}

function updateNavTabs() {
  const showTrefles = !!G.walletVisible || ((CHAPTERS[G.phase] ? CHAPTERS[G.phase].n : 1) >= 2);
  const trefleBtn = document.querySelector('.nav-tab[data-tab="trefles"]');
  if (trefleBtn) {
    trefleBtn.style.display = showTrefles ? '' : 'none';
  }
  if (!showTrefles && currentTab === 'trefles') {
    currentTab = 'enquete';
  }
}

function renderTab() {
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===currentTab));
  const el = document.getElementById('tab-content');
  if (currentTab==='enquete')    el.innerHTML = buildEnquete();
  else if (currentTab==='inventaire') el.innerHTML = buildInventaire();
  else if (currentTab==='trefles')    el.innerHTML = buildTrefles();
  else if (currentTab==='dossier')    el.innerHTML = buildDossier();
}

// =============================================================
// ONGLET ENQUETE
// =============================================================

function buildEnquete() {
  if (G.phase==='chronologie') return buildChrono();
  if (G.phase==='accusation')  return buildAccusation();
  if (G.phase==='end') return '';
  const pc = PC[G.phase]||{}; let h='';
  if (pc.title) h+=`<h2 style="font-family:var(--font-serif);font-size:1.5rem;padding:20px 16px 8px;color:var(--charcoal)">${pc.title}</h2>`;
  if (pc.lines&&pc.lines.length) {
    h+='<div class="card"><div class="narrative">';
    pc.lines.forEach(l=>{ h+=`<p>${l}</p>`; });
    h+='</div></div>';
  }
  if (hasMJSpeech()) {
    const mj=pc.mj;
    h+=`<div class="mj-banner">
      <div class="mj-banner-label">Message</div>
      <div class="mj-banner-name">${mj.name} veut vous parler</div>
      <div class="mj-banner-sub">Allez voir le Maître du Jeu.</div>
      <div class="mj-dots"><div class="mj-dot"></div><div class="mj-dot"></div><div class="mj-dot"></div></div>
    </div>`;
    return h;
  }
  h += buildPhaseSpecific();
  return h;
}

function buildPhaseSpecific() {
  let h = '';

  if (G.phase === 'beatrice_reveal') {
    if (!showBeatriceLetter) {
      h += `
        <div style="padding:0 16px 16px;text-align:center">
          <button class="btn btn-gold" onclick="readBeatriceLetter()">Lire la Lettre</button>
        </div>`;
    } else {
      h += `
        <div class="card" style="border-left:4px solid var(--gold);margin-top:12px;animation:slideUp 0.3s ease">
          <div class="section-title">Lettre de Béatrice</div>
          <div class="narrative" style="font-style:italic">
            <p>J'ai passé vingt ans dans cette maison. J'ai tout vu. Tout tu.</p>
            <p>Armand m'a volé mon héritage. J'ai voulu reprendre ce qui m'appartenait, pièce par pièce.</p>
            <p>Mais j'ai compris qu'Armand ne s'arrêterait pas à me voler, bientôt il allait tenter de me tuer.</p>
            <p>Alors je vais faire croire à ma mort et m'enfuir. »</p>
            <p style="font-weight:bold;color:var(--crimson)">Tout est dans le frigo ! Si il est vide c'est que j'ai réussi !</p>
            <p>  - Béatrice - </p>
          </div>
        </div>
        <div style="padding:0 16px 16px">
          <button class="btn btn-dark" onclick="finishBeatriceLetter()">Continuer l'enquête</button>
        </div>`;
    }
    return h;
  }
  if (G.phase==='currency_puzzle') {
    h+=`<div class="card" id="cpuzzle">
      <div class="section-title">Enigme monnaie</div>
      <p class="narrative" style="margin-bottom:16px">Avez-vous trouvé de l'argent dans la maison ?</p>
      <div id="cp1"><div style="display:flex;gap:10px">
        <button class="btn btn-dark" style="flex:1" onclick="cpYes()">OUI</button>
        <button class="btn btn-outline" style="flex:1" onclick="cpNo()">NON</button>
      </div></div>
      <div id="cp2" style="display:none">
        <p class="narrative" style="margin-bottom:12px">Intéressant, dans ce cas complétez cette équation !</p>
        <p class="narrative" style="font-size:1.3rem;font-weight:bold;margin-bottom:16px">1 sou = 1 …</p>
        <input class="input-field" id="cp-input" type="text" placeholder="Votre réponse…" autocomplete="off" autocapitalize="off"/>
        <div id="cp-err" class="error-msg" style="display:none"></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-dark" style="flex:2" onclick="cpSubmit()">Valider</button>
          <button class="btn btn-ghost" style="flex:1" onclick="cpBack()">←</button>
        </div>
      </div>
      <div id="cp3" style="display:none;padding:12px;background:var(--paper-dark);border-radius:var(--radius-sm)">
        <p style="color:var(--muted);font-style:italic">Continuez à chercher dans la maison.</p>
        <button class="btn btn-ghost" style="margin-top:8px" onclick="cpBack()">← Retour</button>
      </div>
    </div>`;
    return h;
  }

  if (G.phase==='find_clubs') {
    const bal=clubBalance(), canPay=bal>=20;
    h+=`<div class="card">
      <div class="section-title">Interroger Firmin</div>
      <p style="font-size:1.4rem;font-weight:bold;margin-bottom:16px">Coût : 20 ♣</p>
      <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--paper-dark);border-radius:var(--radius-sm);margin-bottom:16px">
        <span style="font-size:2rem">♣</span>
        <div>
          <div style="font-size:.8rem;color:var(--muted)">Votre solde</div>
          <div style="font-size:1.4rem;font-weight:bold;color:${canPay?'var(--gold)':'var(--crimson)'}">${bal} trèfle${bal!==1?'s':''}</div>
        </div>
      </div>
      ${canPay
        ?'<button class="btn btn-gold" onclick="doPay()">Payer 20 ♣</button>'
        :`<p style="color:var(--crimson);font-style:italic;margin-bottom:12px;font-size:.9rem">Il vous manque ${20-bal} trèfle${20-bal!==1?'s':''}.</p>
          <button class="btn btn-outline" onclick="goCardInput()">♣ Ajouter une carte</button>`
      }
    </div>`;
    h+=buildObj(); return h;
  }

  if (G.phase==='bureau_puzzle') {
    h+=`<div class="card" id="bpuzzle">
      <div class="section-title">Carte pliée</div>
      <div id="bp1">
        <p class="narrative" style="margin-bottom:16px">Cette carte a été pliée intentionnellement. Pliez-la comme elle était à l'origine.</p>
        <button class="btn btn-dark" onclick="bpFolded()">J'ai plié la carte</button>
      </div>
      <div id="bp2" style="display:none">
        <p class="narrative" style="margin-bottom:16px">Quel lieu voyez-vous ?</p>
        <input class="input-field" id="bp-input" type="text" placeholder="Votre réponse…" autocomplete="off" autocapitalize="off"/>
        <div id="bp-err" class="error-msg" style="display:none"></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-dark" style="flex:2" onclick="bpSubmit()">Valider</button>
          <button class="btn btn-ghost" style="flex:1" onclick="bpBack()">←</button>
        </div>
      </div>
    </div>`;
    return h;
  }

  h+=buildObj(); return h;
}

function buildObj() {
  const pc=PC[G.phase]; if(!pc||!pc.obj) return '';
  const showBtn=['intro','find_kd','find_qd','find_ah','find_8h','find_10d','find_as'].includes(G.phase);
  return `<div class="obj-box">
    <div class="obj-label">Objectif</div>
    <div class="obj-title">${pc.obj}</div>
  </div>
  ${showBtn?'<div style="padding:0 16px 12px"><button class="btn btn-gold" onclick="goCardInput()">✦ Ajouter une carte</button></div>':''}`;
}

function buildChrono() {
  if (!shuffledChrono.length) shuffledChrono=[...CHRONO_EVENTS].sort(()=>Math.random()-.5);
  const avail=shuffledChrono.filter(e=>!chronoAnswer.find(a=>a.id===e.id));
  let h=`<div class="pad">
    <h2 style="font-family:var(--font-serif);font-size:1.5rem;margin-bottom:6px">Reconstituez l'histoire</h2>
    <p style="color:var(--muted);margin-bottom:20px;font-size:.9rem">Tapez les événements dans l'ordre chronologique.</p>
    <div class="section-title">Votre ordre (${chronoAnswer.length}/${CHRONO_EVENTS.length})</div>
    <div>
      ${chronoAnswer.length===0
        ?'<div style="padding:14px;border:2px dashed var(--border-strong);border-radius:var(--radius-sm);text-align:center;color:var(--muted-light);font-style:italic">Tapez un événement ci-dessous</div>'
        :chronoAnswer.map((e,i)=>`<div class="chrono-event placed" onclick="chRemove('${e.id}')"><div class="chrono-num">${i+1}</div><div class="chrono-label">${e.label}</div><div class="chrono-remove">×</div></div>`).join('')
      }
    </div>`;
  if (avail.length) {
    h+=`<div class="section-title" style="margin-top:20px">Événements</div><div>
      ${avail.map(e=>`<div class="chrono-event" onclick="chAdd('${e.id}')"><div class="chrono-num" style="color:var(--muted)">${e.id}</div><div class="chrono-label">${e.label}</div></div>`).join('')}
    </div>`;
  }
  if (chronoAnswer.length===CHRONO_EVENTS.length) {
    h+=`<div id="ch-err" class="error-msg" style="display:none;text-align:center;margin-top:12px"></div>
      <div style="margin-top:16px"><button class="btn btn-gold" onclick="chVerify()">Vérifier l'ordre</button></div>`;
  }
  h+=`<div style="margin-top:16px;padding:12px;background:var(--paper-dark);border-radius:var(--radius-sm);font-size:.8rem;color:var(--muted);text-align:center">Tapez un événement placé pour le retirer.</div></div>`;
  return h;
}

function buildAccusation() {
  return `<div class="pad">
    <h2 style="font-family:var(--font-serif);font-size:1.6rem;text-align:center;margin-bottom:8px">Qui a tué Béatrice ?</h2>
    <p style="color:var(--muted);font-style:italic;text-align:center;margin-bottom:32px">Il est temps de désigner le coupable.</p>
    <div id="acc-err" class="error-msg" style="display:none;text-align:center"></div>
    ${['Firmin','Armand','Béatrice','Personne'].map(s=>`<button class="suspect-btn" onclick="accuse('${s}')">${s}</button>`).join('')}
  </div>`;
}

// =============================================================
// ONGLETS INVENTAIRE / TREFLES / DOSSIER
// =============================================================

function buildInventaire() {
  const ITEMS=[
    {id:'Jd', s:'diamond',r:'J', lbl:'Firmin',       cat:'p'},
    {id:'Kd', s:'diamond',r:'K', lbl:'Armand',       cat:'p'},
    {id:'Qd', s:'diamond',r:'Q', lbl:'Beatrice',     cat:'p'},
    {id:'Ah', s:'heart',  r:'A', lbl:'Faux coeur',   cat:'e'},
    {id:'8h', s:'heart',  r:'8', lbl:'Carte pliee',  cat:'e'},
    {id:'10d',s:'diamond',r:'10',lbl:'Comptes',      cat:'e'},
    {id:'As', s:'spade',  r:'A', lbl:"L'arme",       cat:'e'},
    {id:'7s', s:'spade',  r:'7', lbl:'Empreinte',    cat:'f'},
    {id:'Jh', s:'heart',  r:'J', lbl:'Message',      cat:'f'},
  ];
  function card(item) {
    const found=G.discovered.includes(item.id);
    const isRed=item.s==='diamond'||item.s==='heart';
    const sym=SUITS[item.s].symbol;
    return `<div class="inv-card ${found?'found':'locked'}">
      ${found
        ?`<div class="inv-card-sym ${isRed?'red':'black'}">${item.r}${sym}</div><div class="inv-card-lbl">${item.lbl}</div>`
        :`<div class="inv-card-sym" style="color:var(--border-strong)">?</div><div class="inv-card-lbl">????</div>`
      }
    </div>`;
  }
  function grp(cat,title) {
    return `<div style="margin-bottom:24px"><div class="section-title">${title}</div><div class="inv-grid">${ITEMS.filter(i=>i.cat===cat).map(card).join('')}</div></div>`;
  }
  return `<div class="pad">
    <h2 style="font-family:var(--font-serif);font-size:1.6rem;margin-bottom:20px">Inventaire</h2>
    ${grp('p','Personnages')} ${grp('e','Preuves')} ${grp('f','Fausses pistes')}
    <div class="section-title">Zones autorisées</div>
    <div class="zone-tag active"><span>🏠</span><span class="zone-tag-name">Maison</span><span class="zone-badge">AUTORISE</span></div>
    <div class="zone-tag ${G.gardenOpen?'active':''}"><span>🌿</span><span class="zone-tag-name">Jardin</span>${G.gardenOpen?'<span class="zone-badge">AUTORISE</span>':''}</div>
    <div class="zone-tag ${G.bureauOpen?'active':''}"><span>✒️</span><span class="zone-tag-name">Bureau</span>${G.bureauOpen?'<span class="zone-badge">AUTORISE</span>':''}</div>
  </div>`;
}

function buildTrefles() {
  if (!G.walletVisible) return `<div class="locked-notice"><div class="big">♣</div><h2>Portefeuille</h2><p>Les trèfles ne sont pas encore identifiés comme monnaie.</p></div>`;
  const bal=clubBalance();
  const total=G.clubs.reduce((s,id)=>s+({'2c':2,'3c':3,'4c':4,'5c':5,'6c':6}[id]||0),0);
  const CL=[{id:'2c',r:'2',v:2},{id:'3c',r:'3',v:3},{id:'4c',r:'4',v:4},{id:'5c',r:'5',v:5},{id:'6c',r:'6',v:6}];
  return `<div class="pad">
    <h2 style="font-family:var(--font-serif);font-size:1.6rem;margin-bottom:16px">Portefeuille</h2>
    <div class="trefle-balance">
      <div class="trefle-amount">${bal}</div>
      <div class="trefle-unit">♣ trèfle${bal!==1?'s':''}</div>
      ${G.spent>0?`<div class="trefle-spent">Total : ${total} — Dépensé : ${G.spent}</div>`:''}
    </div>
    <div class="section-title">Cartes trouvées</div>
    ${CL.map(c=>{const f=G.clubs.includes(c.id);return`<div class="club-row ${f?'found':''}">
      <div class="club-rank">${c.r}♣</div>
      <div class="club-info"><div class="club-status">${f?`Valeur : ${c.v} trèfle${c.v!==1?'s':''}`:'Non trouvée'}</div></div>
      ${f?`<div class="club-val">+${c.v}</div>`:''}
    </div>`}).join('')}
    ${G.clubs.length<5?'<div style="margin-top:16px"><button class="btn btn-outline" onclick="goCardInput()">♣ Ajouter une carte</button></div>':''}
  </div>`;
}

function buildDossier() {
  const ci=phaseIdx(G.phase);
  const unlocked=DOSSIER.filter(e=>{
    if (e.rh) return G.discovered.includes(e.rh);
    return phaseIdx(e.phase)<=ci;
  });
  if (!unlocked.length) return `<div class="locked-notice"><div class="big">📋</div><h2>Dossier vide</h2><p>Les informations s'accumuleront au fil de l'enquête.</p></div>`;
  const base=unlocked.filter(e=>['victime','suspect1','temoin'].includes(e.id));
  const rev=unlocked.filter(e=>!['victime','suspect1','temoin'].includes(e.id)&&!e.rh);
  const leads=unlocked.filter(e=>e.rh);
  function ents(list,cls='') { return list.map(e=>`<div class="dossier-entry ${cls}"><div class="dossier-key">${e.k}</div><div class="dossier-val">${e.v}</div></div>`).join(''); }
  return `<div class="pad">
    <h2 style="font-family:var(--font-serif);font-size:1.6rem;margin-bottom:20px">Dossier d'enquête</h2>
    ${base.length?'<div class="section-title">Personnes</div>'+ents(base):''}
    ${rev.length?'<div class="section-title" style="margin-top:20px">Révélations</div>'+ents(rev):''}
    ${leads.length?'<div class="section-title" style="margin-top:20px">Pistes</div>'+ents(leads,'lead'):''}
  </div>`;
}


function readBeatriceLetter() {
  showBeatriceLetter = true;
  render();
}

function finishBeatriceLetter() {
  showBeatriceLetter = false;
  G.phase = 'find_ah';
  saveGame();
  render();
}

// =============================================================
// HANDLERS PUZZLES
// =============================================================

function cpYes(){ document.getElementById('cp1').style.display='none'; document.getElementById('cp2').style.display='block'; }
function cpNo(){  document.getElementById('cp1').style.display='none'; document.getElementById('cp3').style.display='block'; }
function cpBack(){ document.getElementById('cp1').style.display='block'; document.getElementById('cp2').style.display='none'; document.getElementById('cp3').style.display='none'; }
function cpSubmit(){
  const raw=document.getElementById('cp-input').value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if (['trefle','trefles'].includes(raw)) { solveCurrencyPuzzle(); render(); }
  else {
    const el=document.getElementById('cp-err'); el.textContent="Ce n'est pas ça !"; el.style.display='block';
    el.classList.add('anim-shake'); setTimeout(()=>{el.style.display='none';el.classList.remove('anim-shake');},2000);
  }
}

function bpFolded(){ document.getElementById('bp1').style.display='none'; document.getElementById('bp2').style.display='block'; }
function bpBack(){   document.getElementById('bp1').style.display='block'; document.getElementById('bp2').style.display='none'; }
function bpSubmit(){
  const raw=document.getElementById('bp-input').value.trim().toLowerCase();
  if (['bureau','le bureau'].includes(raw)) { solveBureau(); render(); }
  else {
    const el=document.getElementById('bp-err'); el.textContent='Regardez attentivement ce que les plis rapprochent…'; el.style.display='block';
    setTimeout(()=>{el.style.display='none';},2500);
  }
}

function chAdd(id){ const e=CHRONO_EVENTS.find(x=>x.id===id); if(e&&!chronoAnswer.find(a=>a.id===id)) chronoAnswer.push(e); renderTab(); }
function chRemove(id){ chronoAnswer=chronoAnswer.filter(a=>a.id!==id); renderTab(); }
function chVerify(){
  const ok=[...CHRONO_EVENTS].sort((a,b)=>a.correct-b.correct).map(e=>e.id);
  const correct=chronoAnswer.every((e,i)=>e.id===ok[i])&&chronoAnswer.length===ok.length;
  if (correct) { solveChronologie(); render(); }
  else {
    const el=document.getElementById('ch-err');
    if(el){ el.textContent="L'ordre n'est pas correct."; el.style.display='block'; el.classList.add('anim-shake'); setTimeout(()=>{el.style.display='none';el.classList.remove('anim-shake');},2500); }
  }
}

function accuse(suspect){
  if (suspect==='Armand') { solveAccusation(); showEndScreen(); }
  else {
    const el=document.getElementById('acc-err');
    if(el){ el.textContent='Ce n\'est pas la bonne réponse. Réfléchissez encore.'; el.style.display='block'; el.classList.add('anim-shake'); setTimeout(()=>{el.style.display='none';el.classList.remove('anim-shake');},2500); }
  }
}

function doPay(){ if(payFirmin()) render(); }

// =============================================================
// SAISIE CARTE
// =============================================================

function goCardInput(){
  selectedSuit=null; selectedRank=null;
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('card-input-screen').classList.add('active');
  renderCardInput();
}

function renderCardInput(){
  const SUITS_ORDER=['diamond','heart','spade','club'];
  const RANKS=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  document.getElementById('suit-grid').innerHTML=SUITS_ORDER.map(s=>{
    const isRed=s==='diamond'||s==='heart';
    return `<button class="suit-btn ${selectedSuit===s?'selected':''}" onclick="selSuit('${s}')">
      <div class="suit-symbol ${isRed?'red':'black'}">${SUITS[s].symbol}</div>
      <div class="suit-name">${SUITS[s].name}</div>
    </button>`;
  }).join('');
  document.getElementById('rank-grid').innerHTML=RANKS.map(r=>
    `<button class="rank-btn ${selectedRank===r?'selected':''}" onclick="selRank('${r}')">${r}</button>`
  ).join('');
  const prev=document.getElementById('card-preview');
  if (selectedSuit&&selectedRank){
    const isRed=selectedSuit==='diamond'||selectedSuit==='heart';
    prev.style.display='flex';
    prev.innerHTML=`<div class="preview-rank ${isRed?'red':'black'}">${selectedRank}</div><div class="preview-suit ${isRed?'red':'black'}">${SUITS[selectedSuit].symbol}</div>`;
  } else { prev.style.display='none'; }
  document.getElementById('validate-card-btn').disabled=!(selectedSuit&&selectedRank);
}

function selSuit(s){ selectedSuit=s; renderCardInput(); }
function selRank(r){ selectedRank=r; renderCardInput(); }

function validateCard(){
  if (!selectedSuit||!selectedRank) return;
  let cardId=null;
  for (const [id,card] of Object.entries(CARDS)) {
    if (card.suit===selectedSuit&&card.rank===selectedRank){ cardId=id; break; }
  }
  if (!cardId){ showFeedback('not_found',null); return; }
  const result=discoverCard(cardId);
  if (result.type==='not_found')     { showFeedback('not_found',null); return; }
  if (result.type==='already_found') { showFeedback('already',null); return; }
  if (result.type==='early')         { showFeedback('early',null); return; }
  if (result.type==='currency_early'){ showFeedback('currency_early',null); return; }
  showReveal(result.cardId||cardId, result.type);
}

function showFeedback(type, cardId){
  let icon='❓',title='',msg='';
  if (type==='not_found') { icon='❌'; title='Carte inconnue'; msg="Cette carte n'existe pas dans ce jeu."; }
  else if (type==='already') { icon='🔁'; title='Déjà enregistrée'; msg='Vous avez déjà trouvé cette carte.'; }
  else if (type==='early') { icon='⚠️'; title='Preuve enregistrée'; msg="Cette carte semble importante… mais vous ne pouvez pas encore comprendre ce qu'elle signifie. Continuez votre enquête."; }
  else if (type==='currency_early') { icon='🪙'; title='Intéressant…'; msg='Cela sera utile plus tard. Cette trouvaille a été enregistrée.'; }
  const bg=type==='early'?'var(--charcoal)':'var(--cream)';
  const tc=type==='early'?'var(--cream)':'var(--charcoal)';
  const pc=type==='early'?'rgba(245,240,232,.75)':'var(--muted)';
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const scr=document.getElementById('feedback-screen');
  scr.style.background=bg;
  scr.innerHTML=`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;min-height:100dvh;padding:40px 24px;gap:24px;text-align:center">
    <div style="font-size:3rem">${icon}</div>
    <h2 style="font-family:var(--font-serif);font-size:1.5rem;color:${tc}">${title}</h2>
    <p style="color:${pc};font-family:var(--font-serif);max-width:280px;line-height:1.7">${msg}</p>
    <button class="btn btn-gold" style="max-width:280px" onclick="backToGame()">Continuer l'enquête</button>
  </div>`;
  scr.classList.add('active');
}

function showReveal(cardId, resultType){
  const card=CARDS[cardId], rev=CARD_REVEAL[cardId];
  if (!card||!rev){ backToGame(); return; }
  const isRed=card.suit==='diamond'||card.suit==='heart';
  const sym=SUITS[card.suit].symbol;
  const lbl=resultType==='currency'?'Trèfle trouvé':(card.type==='redHerring'?'Indice trouvé':'Carte identifiée');
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const scr=document.getElementById('reveal-screen');
  scr.innerHTML=`
    <div class="reveal-label anim-slide-up">${lbl}</div>
    <div class="reveal-card-big">
      <div class="reveal-rank ${isRed?'red':'black'}">${card.rank}</div>
      <div class="reveal-suit-sym ${isRed?'red':'black'}">${sym}</div>
    </div>
    <div class="reveal-title anim-slide-up">${rev.title}</div>
    <div class="reveal-lines anim-slide-up">${rev.lines.map(l=>`<p>${l}</p>`).join('')}</div>
    <button class="btn btn-gold anim-slide-up" style="max-width:280px" onclick="backToGame()">Continuer l'enquête</button>`;
  scr.classList.add('active');
}

function backToGame(){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  if (G.phase==='end'){ showEndScreen(); return; }
  document.getElementById('game-screen').classList.add('active');
  render();
  const mc = document.querySelector('#game-screen .main-content');
  if (mc) mc.scrollTop = 0;
}

// =============================================================
// ECRAN FINAL
// =============================================================

function showEndScreen(){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const scr=document.getElementById('end-screen');
  scr.classList.add('active');
  let linesHTML='', delay=0;
  END_LINES.forEach(line=>{
    if (line==='---') { linesHTML+=`<div class="end-sep">✦</div>`; }
    else { linesHTML+=`<div class="end-line" style="animation-delay:${delay}ms">${line}</div>`; delay+=250; }
  });
  scr.innerHTML=`
    <div style="font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);font-weight:700;animation:fadeIn .8s ease">Message de Béatrice de Carreau</div>
    <div class="end-letter">${linesHTML}</div>
    <div class="end-fin" style="animation:slideUp .8s ${delay}ms ease both">FIN</div>
    <button class="btn btn-ghost" style="color:rgba(245,240,232,.4);border-color:rgba(245,240,232,.15);max-width:240px;animation:fadeIn .6s ${delay+600}ms ease both" onclick="goHome()">Retour à l'accueil</button>`;
}

// =============================================================
// MODE MJ
// =============================================================

function openMJ(){
  document.getElementById('mj-overlay').classList.add('open');
  hasMJSpeech() ? renderMJSpeech() : renderMJDash();
}
function closeMJ(){ document.getElementById('mj-overlay').classList.remove('open'); render(); }

function renderMJSpeech(){
  const mj=PC[G.phase].mj;
  const linesHTML=mj.lines.map(l=>{
    if (l==='---') return '<div class="mj-sep">✦</div>';
    const bold=l.startsWith('**')&&l.endsWith('**');
    return `<div class="mj-line ${bold?'bold':''}">${bold?l.slice(2,-2):l}</div>`;
  }).join('');
  document.getElementById('mj-overlay').innerHTML=`<div class="mj-inner">
    <div class="mj-header">
      <span style="font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);font-weight:700">Mode Maître du Jeu</span>
      <button style="background:none;border:none;color:var(--muted-light);cursor:pointer;padding:8px" onclick="renderMJDash()">Dashboard →</button>
    </div>
    <div class="mj-speech-char">
      <span class="mj-speech-emoji">${mj.emoji}</span>
      <div class="mj-speech-name">${mj.name}</div>
      <div class="mj-speech-sub">Lisez ce texte à voix haute</div>
    </div>
    <div class="mj-speech-box">${linesHTML}</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <button class="btn btn-gold" onclick="mjValidate()">J'ai terminé — Continuer le jeu</button>
      <button class="btn btn-ghost" style="color:var(--muted-light)" onclick="closeMJ()">Retour sans valider</button>
    </div>
  </div>`;
}

function mjValidate(){ completeMJSpeech(); closeMJ(); }

function renderMJDash(){
  const bal=clubBalance(), exp=getExpectedCard();
  const earlyWarn=G.early.length?`<div class="mj-row"><span class="mj-row-key">⚠ Trop tôt</span><span class="mj-row-val warn">${G.early.join(', ')}</span></div>`:'';
  document.getElementById('mj-overlay').innerHTML=`<div class="mj-inner">
    <div class="mj-header">
      <span class="mj-title-text">🎭 Maître du Jeu</span>
      <button style="background:none;border:none;color:var(--muted-light);cursor:pointer;padding:8px" onclick="closeMJ()">← Retour</button>
    </div>
    ${hasMJSpeech()?`<div style="background:rgba(201,168,76,.15);border:2px solid var(--gold);border-radius:var(--radius);padding:16px;cursor:pointer" onclick="renderMJSpeech()">
      <p style="color:var(--gold);font-weight:700;margin-bottom:4px">⚡ Discours en attente</p>
      <p style="color:var(--muted-light);font-size:.85rem">${PC[G.phase].mj.name} doit parler → Tapez ici</p>
    </div>`:''}
    <div><div class="mj-section-label">État de la partie</div>
      <div class="mj-status">
        <div class="mj-row"><span class="mj-row-key">Phase</span><span class="mj-row-val">${G.phase}</span></div>
        <div class="mj-row"><span class="mj-row-key">Carte attendue</span><span class="mj-row-val">${exp||'—'}</span></div>
        <div class="mj-row"><span class="mj-row-key">Trèfles</span><span class="mj-row-val">${bal} dispo (${G.spent} dépensés)</span></div>
        <div class="mj-row"><span class="mj-row-key">Jardin</span><span class="mj-row-val">${G.gardenOpen?'✓ Ouvert':'✗ Fermé'}</span></div>
        <div class="mj-row"><span class="mj-row-key">Bureau</span><span class="mj-row-val">${G.bureauOpen?'✓ Ouvert':'✗ Fermé'}</span></div>
        <div class="mj-row"><span class="mj-row-key">Découvertes</span><span class="mj-row-val">${G.discovered.join(', ')||'Aucune'}</span></div>
        ${earlyWarn}
      </div>
    </div>
    <div><div class="mj-section-label">Actions</div>
      <div class="mj-actions">
        <button class="btn btn-gold btn-sm" onclick="mjForce()">⏭ Débloquer l'étape suivante</button>
        <button class="btn btn-sm" style="background:rgba(245,240,232,.08);color:var(--cream);border:1px solid rgba(245,240,232,.15)" onclick="mjClubs()">♣ Donner tous les trèfles</button>
        <button class="btn btn-sm" style="background:rgba(245,240,232,.08);color:var(--cream);border:1px solid rgba(245,240,232,.15)" onclick="renderMJSetup()">📋 Guide de mise en place</button>
        <button class="btn btn-sm" style="background:rgba(139,26,26,.2);color:var(--crimson);border:1px solid rgba(139,26,26,.4)" onclick="mjReset()">🔄 Réinitialiser la partie</button>
      </div>
    </div>
  </div>`;
}

function mjForce(){
  const ci=phaseIdx(G.phase), ni=Math.min(ci+1,PHASE_ORDER.length-1);
  G.phase=PHASE_ORDER[ni]; G.mjDone=false;
  if (phaseIdx(G.phase)>=phaseIdx('find_qd')) G.gardenOpen=true;
  if (phaseIdx(G.phase)>=phaseIdx('bureau_puzzle')) G.bureauOpen=true;
  if (phaseIdx(G.phase)>=phaseIdx('find_clubs')) { G.currencyId=true; G.walletVisible=true; }
  saveGame(); renderMJDash();
}

function mjClubs(){
  ['2c','3c','4c','5c','6c'].forEach(id=>{ if(!G.clubs.includes(id)) G.clubs.push(id); });
  G.walletVisible=true; G.currencyId=true; saveGame(); renderMJDash();
}

function renderMJSetup(){
  const items=SETUP.map(s=>`<div class="mj-setup-item"><div class="mj-setup-card">${s.c}</div><div class="mj-setup-loc">${s.l}</div></div>`).join('');
  document.getElementById('mj-overlay').innerHTML=`<div class="mj-inner">
    <div class="mj-header">
      <span style="font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);font-weight:700">Guide de mise en place</span>
      <button style="background:none;border:none;color:var(--muted-light);cursor:pointer;padding:8px" onclick="renderMJDash()">← Dashboard</button>
    </div>
    <p style="color:var(--muted-light);font-size:.85rem">Cachez les cartes physiques avant la partie.</p>
    ${items}
  </div>`;
}

function mjReset(){
  if (confirm('Réinitialiser complètement ? Action irréversible.')) {
    resetGame(); document.getElementById('mj-overlay').classList.remove('open'); goHome();
  }
}

// =============================================================
// NAVIGATION GLOBALE
// =============================================================

function goHome(){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('home').classList.add('active');
  const hasSave=!!localStorage.getItem('lds_v2');
  document.getElementById('resume-btn').style.display=hasSave?'flex':'none';
}

function goGame(){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('game-screen').classList.add('active');
  currentTab='enquete'; render();
}

function startNew(){
  if (localStorage.getItem('lds_v2')&&!confirm('Effacer la progression et recommencer ?')) return;
  resetGame(); goGame();
}

function resumeGame(){ G=(()=>{try{const r=localStorage.getItem('lds_v2');if(!r)return defaultGame();const g=JSON.parse(r);return g.phase?g:defaultGame();}catch(e){return defaultGame();}})(); goGame(); }

function switchTab(tab){ currentTab=tab; renderTab(); const mc = document.querySelector('#game-screen .main-content'); if (mc) mc.scrollTop = 0; }

function logoTap(){
  logoTaps++;
  if (logoTimer) clearTimeout(logoTimer);
  logoTimer=setTimeout(()=>{logoTaps=0;},2000);
  if (logoTaps>=5){ logoTaps=0; clearTimeout(logoTimer); openMJ(); }
}

// =============================================================
// INIT
// =============================================================

window.addEventListener('DOMContentLoaded', goHome);
