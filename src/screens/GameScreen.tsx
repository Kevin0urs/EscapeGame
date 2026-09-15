import { useGameStore } from '../store/gameStore';
import { WalletDisplay } from '../components/WalletDisplay';
import { ChapterIndicator } from '../components/ChapterIndicator';
import { EnqueteTab } from './EnqueteTab';
import { InventaireTab } from './InventaireTab';
import { TreflesTab } from './TreflesTab';
import { DossierTab } from './DossierTab';
import { CardRevealScreen } from './CardRevealScreen';
import { getClubBalance } from '../engine/progression';
import type { Tab } from '../engine/types';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'enquete', label: 'Enquête', icon: '🔍' },
  { id: 'inventaire', label: 'Inventaire', icon: '🃏' },
  { id: 'trefles', label: 'Trèfles', icon: '♣' },
  { id: 'dossier', label: 'Dossier', icon: '📋' },
];

export function GameScreen() {
  const { tab, setTab, game, pendingReveal, tapLogo } = useGameStore();
  const balance = getClubBalance(game);
  const walletVisible = game.walletUnlocked;

  // Si une révélation est en attente, l'afficher
  if (pendingReveal) {
    return <CardRevealScreen reveal={pendingReveal} />;
  }

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <span
          className="app-header__logo"
          onClick={tapLogo}
          role="button"
          aria-label="Logo — tap 5 fois pour le mode Maître du Jeu"
        >
          LE DERNIER SERVICE
        </span>
        {walletVisible && <WalletDisplay balance={balance} />}
      </header>

      {/* Chapitre */}
      <ChapterIndicator phase={game.phase} />

      {/* Contenu principal */}
      <main className="app-content">
        {tab === 'enquete' && <EnqueteTab />}
        {tab === 'inventaire' && <InventaireTab />}
        {tab === 'trefles' && <TreflesTab />}
        {tab === 'dossier' && <DossierTab />}
      </main>

      {/* Navigation basse */}
      <nav className="app-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-tab ${tab === t.id ? 'nav-tab--active' : ''}`}
            onClick={() => setTab(t.id)}
            aria-label={t.label}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            <span className="nav-tab__icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}