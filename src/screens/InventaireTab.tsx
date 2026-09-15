import { useGameStore } from '../store/gameStore';
import { SUIT_SYMBOLS } from '../engine/cards';

interface InventoryItem {
  cardId: string;
  suit: string;
  rank: string;
  label: string;
  category: 'characters' | 'proofs' | 'redHerrings';
  isRed: boolean;
}

const MAIN_ITEMS: InventoryItem[] = [
  { cardId: 'Jd', suit: 'diamond', rank: 'J', label: 'Firmin', category: 'characters', isRed: true },
  { cardId: 'Kd', suit: 'diamond', rank: 'K', label: 'Armand', category: 'characters', isRed: true },
  { cardId: 'Qd', suit: 'diamond', rank: 'Q', label: 'Béatrice', category: 'characters', isRed: true },
  { cardId: 'Ah', suit: 'heart', rank: 'A', label: 'Faux cœur', category: 'proofs', isRed: true },
  { cardId: '8h', suit: 'heart', rank: '8', label: 'Pliage', category: 'proofs', isRed: true },
  { cardId: '10d', suit: 'diamond', rank: '10', label: 'Comptes', category: 'proofs', isRed: true },
  { cardId: 'As', suit: 'spade', rank: 'A', label: "L'arme", category: 'proofs', isRed: false },
  { cardId: '7s', suit: 'spade', rank: '7', label: 'Empreinte', category: 'redHerrings', isRed: false },
  { cardId: 'Jh', suit: 'heart', rank: 'J', label: 'Message', category: 'redHerrings', isRed: true },
];

function InventoryCard({ item, found }: { item: InventoryItem; found: boolean }) {
  return (
    <div className={`inventory-card ${found ? 'inventory-card--found' : 'inventory-card--locked'}`}>
      {found ? (
        <>
          <span
            className="inventory-card__symbol"
            style={{ color: item.isRed ? 'var(--suit-red)' : 'var(--suit-black)', fontFamily: 'var(--font-serif)', fontWeight: 'bold' }}
          >
            {item.rank}{SUIT_SYMBOLS[item.suit]}
          </span>
          <span className="inventory-card__label">{item.label}</span>
        </>
      ) : (
        <>
          <span className="inventory-card__symbol" style={{ color: 'var(--border-strong)', fontSize: 'var(--text-lg)' }}>?</span>
          <span className="inventory-card__label">????</span>
        </>
      )}
    </div>
  );
}

export function InventaireTab() {
  const { game } = useGameStore();
  const { discoveredCards } = game;

  const characters = MAIN_ITEMS.filter(i => i.category === 'characters');
  const proofs = MAIN_ITEMS.filter(i => i.category === 'proofs');
  const redHerrings = MAIN_ITEMS.filter(i => i.category === 'redHerrings');

  const isFound = (cardId: string) =>
    discoveredCards.includes(cardId) ||
    (cardId === '7s' && discoveredCards.includes('7s')) ||
    (cardId === 'Jh' && discoveredCards.includes('Jh'));

  return (
    <div className="screen-pad">
      <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-2xl)' }}>
        Inventaire
      </h2>

      {/* Personnages */}
      <div className="inventory-section">
        <p className="inventory-section__title">Personnages</p>
        <div className="inventory-grid">
          {characters.map(item => (
            <InventoryCard key={item.cardId} item={item} found={isFound(item.cardId)} />
          ))}
        </div>
      </div>

      {/* Preuves */}
      <div className="inventory-section">
        <p className="inventory-section__title">Preuves</p>
        <div className="inventory-grid">
          {proofs.map(item => (
            <InventoryCard key={item.cardId} item={item} found={isFound(item.cardId)} />
          ))}
        </div>
      </div>

      {/* Fausses pistes */}
      <div className="inventory-section">
        <p className="inventory-section__title">Fausses pistes</p>
        <div className="inventory-grid">
          {redHerrings.map(item => (
            <InventoryCard key={item.cardId} item={item} found={isFound(item.cardId)} />
          ))}
        </div>
      </div>

      {/* Zones débloquées */}
      <div className="inventory-section">
        <p className="inventory-section__title">Zones autorisées</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <ZoneTag label="Maison" active={true} icon="🏠" />
          <ZoneTag label="Jardin" active={game.gardenUnlocked} icon="🌿" />
          <ZoneTag label="Bureau" active={game.bureauUnlocked} icon="🖊️" />
        </div>
      </div>
    </div>
  );
}

function ZoneTag({ label, active, icon }: { label: string; active: boolean; icon: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      background: active ? 'var(--charcoal)' : 'var(--surface-raised)',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
      opacity: active ? 1 : 0.4,
    }}>
      <span>{icon}</span>
      <span style={{
        fontWeight: 600,
        color: active ? 'var(--cream)' : 'var(--muted)',
        fontSize: 'var(--text-base)',
      }}>
        {label}
      </span>
      {active && (
        <span style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em' }}>
          AUTORISÉ
        </span>
      )}
    </div>
  );
}