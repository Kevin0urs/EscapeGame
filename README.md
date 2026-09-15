# LE DERNIER SERVICE — Webapp Escape Game Mobile

Webapp mobile-first d'enquête narrative et contrôleur de progression pour un escape game / murder mystery à domicile ("LE DERNIER SERVICE — Une enquête de Béatrice de Carreau").

L'application est **100% statique**, s'exécute entièrement dans le navigateur client, conserve la progression dans `localStorage` et fonctionne parfaitement **hors-ligne** après chargement (PWA).

---

## 🚀 DÉMARRAGE RAPIDE

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement en mode développement local
```bash
npm run dev
```
Ouvrez votre navigateur à l'adresse indiquée (ex: `http://localhost:5173/`).

### 3. Build pour la production (GitHub Pages)
```bash
npm run build
```
Cette commande génère le dossier autonome `dist/` prêt à être hébergé.

---

## 🌐 DÉPLOIEMENT GITHUB PAGES

Le projet est configuré avec un chemin relatif (`base: './'` dans `vite.config.ts`). Cela signifie que l'application fonctionnera sur n'importe quelle URL sous-domaine GitHub Pages sans nécessiter de serveur Node ou d'API.

### Étapes pour déployer sur GitHub Pages :
1. Créez votre dépôt sur GitHub et poussez votre code.
2. Exécutez `npm run build`.
3. Déployez le contenu du dossier `dist/` sur la branche `gh-pages` (manuellement ou avec l'action GitHub Pages officielle).
4. Activer GitHub Pages dans les réglages du repository (`Settings > Pages > Source: gh-pages branch` ou `GitHub Actions`).

---

## 🎮 FONCTIONNEMENT DU JEU & RÈGLES

### Ordre de Progression Canonique
L'histoire suit un enchaînement strict :
```text
J♦ (Firmin)
  ↓
K♦ (Armand)
  ↓
Recherche des trèfles & Identification de la monnaie ("1 sous = Trèfle")
  ↓
Portefeuille débloqué (Paiement de 5♣ à Firmin)
  ↓
Déblocage de la zone JARDIN → Q♦ (Béatrice)
  ↓
A♥ (Faux Cœur)
  ↓
8♥ (Carte pliée → Énigme BUREAU)
  ↓
10♦ (Les Comptes)
  ↓
A♠ (L'Arme du crime)
  ↓
Reconstitution Chronologique (7 faits)
  ↓
Accusation finale (ARMAND)
  ↓
Écran Final & Monologue de Béatrice (FIN)
```

### 🃏 Gestion des cartes trouvées trop tôt (`discoveredEarly`)
Si les joueurs trouvent une carte principale en avance (ex: `10♦` ou `A♠` avant l'étape requise) :
* L'application affiche un écran **"PREUVE ENREGISTRÉE - Vous ne pouvez pas encore comprendre ce qu'elle signifie"**.
* La carte est sauvegardée dans l'état avec le statut `discoveredEarly = true`.
* **Aucun spoiler narratif n'est révélé.**
* Lorsque les joueurs atteignent naturellement l'étape requise, l'application reconnaît la carte et débloque immédiatement son contenu sans nécessiter une nouvelle saisie.

### ♣️ Portefeuille de Trèfles
* Les cartes `2♣`, `3♣`, `4♣`, `5♣`, `6♣` ajoutent leur valeur au portefeuille.
* Le portefeuille et l'onglet **TRÈFLES** n'apparaissent dans l'interface qu'une fois la monnaie identifiée par les joueurs.
* Le témoignage étendu de Firmin nécessite au moins **5♣**.

---

## 🎭 MODE MAÎTRE DU JEU (MJ) & ROLEPLAY

### Accès au Mode MJ
Tapoter **5 fois rapidement sur le titre "LE DERNIER SERVICE"** dans la barre supérieure header (ou utiliser le bouton MJ rouge si activé).

### Consigne de Roleplay MJ (Témoignages & Monologues)
Quand un personnage doit parler dans l'histoire, l'écran des joueurs affiche un bandeau :
> 🎭 **LE PERSONNAGE [NOM] VEUT VOUS PARLER ! Allez voir le Maître du jeu.**

Le MJ ouvre alors l'interface MJ (5 taps), lit le texte scripté à voix haute en incarnant le personnage, puis valide. Le téléphone est ensuite rendu aux joueurs en mode normal avec l'étape suivante débloquée !

---

## 📂 STRUCTURE DE L'ARCHITECTURE CODE

```text
EscapeGame/
├── public/
│   ├── manifest.json       # Config PWA mobile
│   ├── sw.js               # Service Worker hors-ligne
│   └── favicon.svg
├── src/
│   ├── main.tsx            # Point d'entrée React & PWA
│   ├── App.tsx             # Composant racine & routeur d'écrans
│   ├── index.css           # Styles Tailwind / custom CSS vintage
│   ├── types/
│   │   └── game.ts         # Modèles TypeScript (GameState, Card, GameStage)
│   ├── data/
│   │   ├── cards.ts        # Base de données exhaustive des cartes
│   │   └── story.ts        # Textes narratifs, étapes, objectifs et répliques MJ
│   ├── engine/
│   │   ├── gameEngine.ts   # Moteur de règles purement fonctionnel
│   │   └── storage.ts      # Gestionnaire de persistence localStorage
│   └── components/
│       ├── Header.tsx      # Barre supérieure (Titre, 5-taps MJ, Solde ♣)
│       ├── BottomNav.tsx   # Navigation 4 onglets (Enquête, Inventaire, Trèfles, Dossier)
│       ├── CardInputModal.tsx     # Modal de saisie tactile des cartes
│       ├── CardDiscoveryModal.tsx # Modal d'animation de découverte
│       ├── RoleplayModal.tsx      # Interface de lecture des témoignages par le MJ
│       ├── MasterModeModal.tsx    # Panneau de contrôle MJ (Jump, Trèfles, Reset)
│       ├── HomeScreen.tsx         # Écran d'accueil
│       ├── EndScreen.tsx          # Écran de fin (Monologue de Béatrice)
│       ├── puzzles/
│       │   ├── CurrencyPuzzle.tsx  # Énigme "1 sous = Trèfle"
│       │   ├── FoldPuzzle.tsx      # Énigme "BUREAU" (8♥)
│       │   ├── ChronologyPuzzle.tsx# Énigme de réordonnancement
│       │   └── AccusationPuzzle.tsx# Écran de choix du coupable
│       └── tabs/
│           ├── EnqueteTab.tsx      # Journal principal & objectifs
│           ├── InventaireTab.tsx   # Grille des cartes découvertes
│           ├── TreflesTab.tsx      # Détail du portefeuille
│           └── DossierTab.tsx      # Synthèse du dossier d'enquête
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🛠 HOW TO / PERSONNALISATION DU SCÉNARIO

### Comment ajouter ou modifier une carte ?
Éditez le fichier `src/data/cards.ts` :
```ts
'MON_ID': {
  id: 'MON_ID',
  suit: 'diamond',
  rank: '9',
  type: 'main',
  requiredStage: 3,
  title: 'TITRE DE LA CARTE',
  subtitle: 'Sous-titre',
  description: 'Contenu narratif...'
}
```

### Comment modifier une énigme ou un texte MJ ?
* Pour les étapes et objectifs : modifiez `STAGE_GOALS` dans `src/data/story.ts`.
* Pour les textes à lire à voix haute par le MJ : modifiez `SPEECHES` dans `src/data/story.ts`.
* Pour la réponse des énigmes : ajustez les fonctions de normalisation dans `src/engine/gameEngine.ts`.

---

## 📄 LICENCE & CRÉDITS

* **Scénario & Concept** : *Le Dernier Service — Une enquête de Béatrice de Carreau*
* **Format** : Webapp PWA mobile-first pour jeu de rôle / escape game en maison louée.
