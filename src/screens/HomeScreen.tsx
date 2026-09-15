import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function HomeScreen() {
  const { startNewGame, resumeGame, hasSave, tapLogo } = useGameStore();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleStart() {
    if (hasSave) {
      setShowConfirm(true);
    } else {
      startNewGame();
    }
  }

  return (
    <div className="home-screen">
      {/* Logo — 5 taps pour MJ */}
      <div className="home-screen__title" onClick={tapLogo} style={{ cursor: 'default' }}>
        <div
          className="home-screen__suit-row"
          aria-hidden="true"
        >
          <span>♦</span>
          <span>♥</span>
          <span style={{ color: 'var(--muted)' }}>♠</span>
          <span style={{ color: 'var(--muted)' }}>♣</span>
        </div>
        <h1 className="home-screen__main-title">LE DERNIER<br />SERVICE</h1>
        <p className="home-screen__subtitle">Une enquête de Béatrice de Carreau</p>
      </div>

      <div className="home-screen__buttons">
        {hasSave && (
          <button className="btn btn-gold" onClick={resumeGame}>
            Reprendre l'enquête
          </button>
        )}
        <button className="btn btn-primary" onClick={handleStart}>
          {hasSave ? 'Nouvelle partie' : "Commencer l'enquête"}
        </button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Recommencer ?"
        message="Voulez-vous effacer la progression actuelle et recommencer une nouvelle enquête ?"
        confirmLabel="Recommencer"
        cancelLabel="Annuler"
        danger
        onConfirm={() => { setShowConfirm(false); startNewGame(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}