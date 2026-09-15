# LE DERNIER SERVICE

> Une enquête de Béatrice de Carreau — Escape game mobile-first

Application web statique destinée à piloter un escape game / murder mystery joué entre amis. Fonctionne entièrement hors-ligne une fois chargée, sans backend, sans compte.

---

## Installation rapide

### Prérequis

- [Node.js](https://nodejs.org/) version 18 ou supérieure

### Étapes

```bash
# 1. Dans le dossier du projet
npm install

# 2. Démarrage en développement
npm run dev

# 3. Build pour production
npm run build
```

Le dossier `dist/` est généré et prêt à déployer sur GitHub Pages.

---

## Déploiement sur GitHub Pages

1. Créez un repository GitHub nommé **EscapeGame**
2. Configurez GitHub Pages pour servir depuis la branche `main` / dossier `root`
3. Après le build, poussez le contenu du dossier `dist/` sur la branche `gh-pages`, **ou** utilisez le workflow CI qui build automatiquement
4. L'application sera accessible sur `https://[username].github.io/EscapeGame/`

> **Important** : Si votre repository GitHub s'appelle autrement que `EscapeGame`, modifiez la valeur `base` dans `vite.config.ts` :
> ```ts
> base: '/NOM-DE-VOTRE-REPO/',
> ```

---

## Architecture du projet

```
src/
├── engine/           ← Moteur de jeu pur TypeScript (sans React)
│   ├── types.ts      ← Types GameState, Card, GamePhase…
│   ├── cards.ts      ← Base de données des 14 cartes du jeu
│   ├── scenario.ts   ← Tout le contenu narratif (textes FR)
│   ├── progression.ts← Règles de progression, fonctions pures
│   └── storage.ts    ← saveGame() / loadGame() (localStorage)
├── store/
│   └── gameStore.ts  ← Store Zustand (état global React)
├── screens/          ← Écrans de l'application
│   ├── HomeScreen.tsx
│   ├── GameScreen.tsx       ← Layout principal + onglets
│   ├── EnqueteTab.tsx       ← Onglet ENQUÊTE (flux principal)
│   ├── CardInputScreen.tsx  ← Saisie manuelle d'une carte
│   ├── CardRevealScreen.tsx ← Animation de découverte
│   ├── InventaireTab.tsx    ← Onglet INVENTAIRE
│   ├── TreflesTab.tsx       ← Onglet TRÈFLES / portefeuille
│   ├── DossierTab.tsx       ← Onglet DOSSIER
│   ├── PuzzleChronologie.tsx← Puzzle reconstitution finale
│   ├── AccusationScreen.tsx ← Écran d'accusation
│   ├── EndScreen.tsx        ← Écran final Béatrice
│   └── MJScreen.tsx         ← Mode Maître du Jeu (caché)
└── components/       ← Composants réutilisables
```

---

## Stockage local

La progression est sauvegardée automatiquement dans **localStorage** sous la clé `le_dernier_service_v1`.

Elle contient :
- Phase de jeu actuelle
- Cartes découvertes
- Trèfles trouvés et dépensés
- Puzzles résolus
- Zones débloquées

La sauvegarde est restaurée automatiquement à chaque ouverture. Si le navigateur est fermé ou rechargé, la partie reprend exactement là où elle était.

---

## Ordre de progression du jeu

```
START → J♦ → K♦ → Trèfles libres → Payer 5♣ → Témoignage Firmin
      → Q♦ → A♥ → 8♥ → Puzzle BUREAU → 10♦ → A♠
      → Témoignage final → Chronologie → Accusation → FIN
```

Cartes indépendantes (découvrables à tout moment) : `2♣ 3♣ 4♣ 5♣ 6♣ 7♠ J♥`

---

## Mode Maître du Jeu

Le mode MJ est caché et accessible en **tapant 5 fois sur le logo** dans le header.

### Fonctionnement des discours

Quand un personnage doit parler, l'écran ENQUÊTE affiche :
> « FIRMIN veut vous parler — Allez voir le Maître du Jeu »

Le MJ tape 5 fois sur le logo → le texte du personnage apparaît. Le MJ le lit à voix haute. Il tape **J'ai terminé** → le jeu reprend pour les joueurs.

### Dashboard MJ

Le dashboard donne accès à :
- État complet de la partie
- Phase actuelle + carte attendue
- Actions d'urgence (débloquer étape, ajouter trèfles, marquer carte)
- Guide de mise en place (où cacher les cartes physiques)
- Réinitialisation

---

## Modifier le scénario

### Changer un texte narratif

Toute la narration est dans `src/engine/scenario.ts`.

Chaque `PHASE_CONTENT[phase]` contient :
- `title` : titre affiché aux joueurs
- `playerLines` : texte visible par les joueurs
- `characterSpeech` : texte lu par le MJ à voix haute
- `objective` / `objectiveHint` : objectif actuel

### Ajouter une nouvelle carte

1. Dans `src/engine/cards.ts`, ajouter l'entrée dans `CARDS[]`
2. Définir son type (`main`, `currency`, `redHerring`)
3. Si carte principale : définir `requiredPhase` et `revealPhase`
4. Ajouter le contenu dans `CARD_REVEAL_CONTENT` dans `scenario.ts`

### Modifier une énigme

Les puzzles inline (énigme monnaie, pliage) sont codés dans `src/screens/EnqueteTab.tsx`.
Le puzzle chronologique est dans `src/screens/PuzzleChronologie.tsx`.

Modifiez les tableaux `VALID` pour changer les réponses acceptées.

### Modifier la progression

La séquence de phases est définie dans `PHASE_ORDER` dans `src/engine/types.ts`.

Les transitions sont gérées dans `src/engine/progression.ts` :
- `discoverCard()` : logique de découverte d'une carte
- `completeMJSpeech()` : avance après un discours MJ
- `solveCurrencyPuzzle()`, `solveBureau()`, etc. : résolution de puzzles

---

## Mise en place avant la partie

Cachez les cartes physiques aux emplacements suivants :

| Carte | Emplacement suggéré |
|-------|-------------------|
| J♦ Firmin | Dans les chaussures d'Armand |
| K♦ Armand | Dans les chaussures d'Armand |
| Q♦ Béatrice | Dans le jardin (pot de fleur, pierre) |
| A♥ Faux cœur | Dans le réfrigérateur ou glacière |
| 8♥ Pliage | Sur une table (pré-pliée) |
| 10♦ Comptes | Dans le bureau (tiroir, classeur) |
| A♠ Arme | Près d'un miroir / de l'entrée |
| 2♣–6♣ Trèfles | Cachés dans toute la maison |
| 7♠, J♥ Fausses pistes | Facilement visibles |

> Le guide complet est accessible dans le **Mode MJ → Guide de mise en place**.

---

## PWA — Installation sur téléphone

L'application peut être installée comme une app native sur iOS et Android :

- **iOS Safari** : bouton Partager → « Sur l'écran d'accueil »
- **Android Chrome** : menu → « Ajouter à l'écran d'accueil »

Une fois installée, elle fonctionne **hors connexion**.

---

## Critères de réussite

L'application est considérée comme fonctionnelle si :

1. On peut démarrer une partie depuis l'accueil
2. Saisir J♦ → témoignage Firmin (via MJ)
3. Saisir K♦ → narration Armand + trèfles
4. Collecter des trèfles (2♣–6♣) → monnaie s'accumule
5. Identifier la monnaie (1 sou = trèfle)
6. Payer 5 trèfles → témoignage Firmin + jardin
7. Saisir Q♦ → lettre Béatrice
8. Saisir A♥, 8♥ → puzzle BUREAU
9. Saisir 10♦ → comptes + note Béatrice
10. Saisir A♠ → témoignage final Firmin
11. Résoudre la chronologie (A→B→C→D→E→F→G)
12. Accuser Armand → écran final Béatrice
13. Si une carte est trouvée trop tôt → message neutre, progression préservée
14. Fermer/rouvrir le navigateur → partie restaurée

---

*Bonne enquête. — Béatrice*