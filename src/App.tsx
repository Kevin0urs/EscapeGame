import { useState, useEffect } from 'react';
import { GameState, Suit, Rank, GameStage } from './types/game';
import { loadSavedGame, saveGame, clearSavedGame, createInitialState } from './engine/storage';
import {
  validateCardInput,
  solveCurrencyPuzzle,
  payFirmin,
  solveFoldPuzzle,
  checkChronologySolution,
  makeAccusation,
  completePendingSpeech,
  CardValidationResult,
} from './engine/gameEngine';
import { HomeScreen } from './components/HomeScreen';
import { EndScreen } from './components/EndScreen';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CardInputModal } from './components/CardInputModal';
import { CardDiscoveryModal } from './components/CardDiscoveryModal';
import { RoleplayModal } from './components/RoleplayModal';
import { MasterModeModal } from './components/MasterModeModal';
import { EnqueteTab } from './components/tabs/EnqueteTab';
import { InventaireTab } from './components/tabs/InventaireTab';
import { TreflesTab } from './components/tabs/TreflesTab';
import { DossierTab } from './components/tabs/DossierTab';

export function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadSavedGame());
  const [screen, setScreen] = useState<'home' | 'game'>(() =>
    gameState.currentStage > 0 || gameState.discoveredCards.length > 0 ? 'game' : 'home'
  );

  // Modals state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<CardValidationResult | null>(null);
  const [isMasterModeOpen, setIsMasterModeOpen] = useState(false);
  const [isRoleplayOpen, setIsRoleplayOpen] = useState(false);

  // Auto-save on state updates
  useEffect(() => {
    saveGame(gameState);
  }, [gameState]);

  // Handle Card Input Validation
  const handleValidateCard = (suit: Suit, rank: Rank) => {
    setIsCardModalOpen(false);
    const { newState, result } = validateCardInput(gameState, suit, rank);
    setGameState(newState);
    setValidationResult(result);
  };

  // Puzzle Actions
  const handleSolveCurrency = (answer: string) => {
    const { newState, success } = solveCurrencyPuzzle(gameState, answer);
    setGameState(newState);
    return { success };
  };

  const handlePayFirmin = () => {
    const { newState, success } = payFirmin(gameState);
    setGameState(newState);
    return { success };
  };

  const handleSolveFold = (answer: string) => {
    const { newState, success } = solveFoldPuzzle(gameState, answer);
    setGameState(newState);
    return { success };
  };

  const handleSolveChronology = (order: string[]) => {
    const { newState, success } = checkChronologySolution(gameState, order);
    setGameState(newState);
    return { success };
  };

  const handleAccuse = (suspect: string) => {
    const { newState, success } = makeAccusation(gameState, suspect);
    setGameState(newState);
    return { success };
  };

  // Roleplay speech completion
  const handleCompleteRoleplay = () => {
    setIsRoleplayOpen(false);
    const newState = completePendingSpeech(gameState);
    setGameState(newState);
  };

  // Master Mode Actions
  const handleJumpStage = (stage: GameStage) => {
    setGameState((prev) => ({
      ...prev,
      currentStage: stage,
    }));
  };

  const handleAddClovers = (amount: number) => {
    // Add dummy clover ID to inflate wallet
    const dummyId = `mj_bonus_${Date.now()}`;
    setGameState((prev) => ({
      ...prev,
      foundClubs: [...prev.foundClubs, dummyId],
    }));
  };

  const handleAdvanceStage = () => {
    setGameState((prev) => ({
      ...prev,
      currentStage: Math.min(12, prev.currentStage + 1) as GameStage,
    }));
  };

  const handleResetGame = () => {
    clearSavedGame();
    const fresh = createInitialState();
    setGameState(fresh);
    setScreen('home');
    setIsMasterModeOpen(false);
  };

  // Render Home Screen
  if (screen === 'home') {
    return (
      <HomeScreen
        hasSavedGame={gameState.currentStage > 0 || gameState.discoveredCards.length > 0}
        onStartNew={() => {
          handleResetGame();
          setScreen('game');
        }}
        onResume={() => setScreen('game')}
        onReset={handleResetGame}
      />
    );
  }

  // Render End Screen
  if (gameState.currentStage === 12) {
    return <EndScreen onReset={handleResetGame} />;
  }

  // Render Main Game Interface
  return (
    <div className="min-h-screen bg-[#181615] text-[#e8e2d5] flex flex-col font-sans relative select-none">
      {/* Top Sticky Header */}
      <Header
        state={gameState}
        onOpenMasterMode={() => setIsMasterModeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 max-w-lg w-full mx-auto">
        {gameState.activeTab === 'enquete' && (
          <EnqueteTab
            state={gameState}
            onOpenCardModal={() => setIsCardModalOpen(true)}
            onSolveCurrency={handleSolveCurrency}
            onPayFirmin={handlePayFirmin}
            onSolveFold={handleSolveFold}
            onSolveChronology={handleSolveChronology}
            onAccuse={handleAccuse}
            onOpenRoleplay={() => setIsRoleplayOpen(true)}
          />
        )}

        {gameState.activeTab === 'inventaire' && (
          <InventaireTab state={gameState} />
        )}

        {gameState.activeTab === 'trefles' && (
          <TreflesTab state={gameState} />
        )}

        {gameState.activeTab === 'dossier' && (
          <DossierTab state={gameState} />
        )}
      </main>

      {/* Bottom Fixed Navigation Bar */}
      <BottomNav
        state={gameState}
        activeTab={gameState.activeTab}
        onChangeTab={(tab) =>
          setGameState((prev) => ({ ...prev, activeTab: tab }))
        }
      />

      {/* Card Input Modal */}
      <CardInputModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onValidate={handleValidateCard}
      />

      {/* Card Discovery Result Modal */}
      <CardDiscoveryModal
        result={validationResult}
        onClose={() => setValidationResult(null)}
      />

      {/* MJ Roleplay Testimony Modal */}
      <RoleplayModal
        speech={gameState.pendingSpeech}
        isOpen={isRoleplayOpen}
        onComplete={handleCompleteRoleplay}
        onClose={() => setIsRoleplayOpen(false)}
      />

      {/* Master Mode (MJ) Modal */}
      <MasterModeModal
        isOpen={isMasterModeOpen}
        state={gameState}
        onClose={() => setIsMasterModeOpen(false)}
        onJumpStage={handleJumpStage}
        onAddClovers={handleAddClovers}
        onAdvanceStage={handleAdvanceStage}
        onResetGame={handleResetGame}
        onOpenRoleplay={() => setIsRoleplayOpen(true)}
      />
    </div>
  );
}

export default App;
