import { useGameStore } from '../store/gameStore';
import { getCardById } from '../engine/cards';
import { getClubBalance, getTotalClubsFound } from '../engine/progression';

const CLUB_CARDS = [
  { id: '2c', rank: '2', value: 2 },
  { id: '3c', rank: '3', value: 3 },
  { id: '4c', rank: '4', value: 4 },
  { id: '5c', rank: '5', value: 5 },
  { id: '6c', rank: '6', value: 6 },
];

export function TreflesTab() {
  const { game, goToCardInput } = useGameStore();
  const { foundClubs, spentClubs, walletUnlocked } = game;
  const balance = getClubBalance(game);
  const total = getTotalClubsFound(game);

  if (!walletUnlocked) {
    return (
      <div className="screen-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, textAlign: 'center', gap: 'var(--space-4)' }}>
        <span style={{ fontSize: '4rem' }}>♣</span>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Portefeuille</h2>
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', maxWidth: 280 }}>
          Les trèfles ne sont pas encore identifiés comme monnaie. Continuez votre enquête.
        </p>
      </div>
    );
  }

  return (
    <div className="screen-pad">
      <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-2xl)' }}>
        Portefeuille
      </h2>

      {/* Solde principal */}
      <div style={{
        background: 'var(--charcoal)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        textAlign: 'center',
        marginBottom: 'var(--space-5)',
        border: '2px solid var(--gold)',
        animation: 'slideUp 300ms ease',
      }}>
        <p style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-2)', fontWeight: 700 }}>
          Solde disponible
        </p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 'bold', color: 'var(--gold)', lineHeight: 1 }}>
          {balance}
        </p>
        <p style={{ color: 'var(--muted-light)', fontSize: 'var(--text-lg)', marginTop: 'var(--space-1)' }}>
          ♣ trèfle{balance !== 1 ? 's' : ''}
        </p>
        {spentClubs > 0 && (
          <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>
            Total trouvé : {total} — Dépensé : {spentClubs}
          </p>
        )}
      </div>

      {/* Cartes individuelles */}
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-3)' }}>
        Cartes trouvées
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        {CLUB_CARDS.map(({ id, rank, value }) => {
          const found = foundClubs.includes(id);
          return (
            <div
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--space-3) var(--space-4)',
                background: found ? 'var(--surface-raised)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${found ? 'var(--gold)' : 'var(--border)'}`,
                opacity: found ? 1 : 0.4,
                gap: 'var(--space-3)',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-xl)',
                fontWeight: 'bold',
                color: 'var(--suit-black)',
                width: 40,
              }}>
                {rank}♣
              </span>
              <span style={{ flex: 1, color: found ? 'var(--ink)' : 'var(--muted)', fontWeight: found ? 600 : 400 }}>
                {found ? `Valeur : ${value} trèfle${value !== 1 ? 's' : ''}` : 'Non trouvée'}
              </span>
              {found && (
                <span style={{ color: 'var(--gold)', fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>
                  +{value}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bouton ajouter */}
      {foundClubs.length < CLUB_CARDS.length && (
        <button className="btn btn-outline" onClick={goToCardInput}>
          ♣ Ajouter une carte de trèfle
        </button>
      )}

      {/* Explication */}
      <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'var(--paper-dark)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center' }}>
          « Armand cachait régulièrement de l'argent dans la maison. »
        </p>
      </div>
    </div>
  );
}