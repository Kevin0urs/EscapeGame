import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PHASE_CONTENT, MJ_SETUP_GUIDE } from '../engine/scenario';
import { hasPendingMJSpeech, getClubBalance, getExpectedCard } from '../engine/progression';
import { CARDS, SUIT_SYMBOLS } from '../engine/cards';
import { ConfirmDialog } from '../components/ConfirmDialog';

type MJView = 'speech' | 'dashboard' | 'setup' | 'markCard';

export function MJScreen() {
  const {
    game, goToGame, completeMJSpeech,
    mjForceNext, mjAddFiveClubs, mjMarkCard, mjReset,
  } = useGameStore();

  const pendingMJ = hasPendingMJSpeech(game);
  const content = PHASE_CONTENT[game.phase];
  const speech = content.characterSpeech;

  const [view, setView] = useState<MJView>(pendingMJ ? 'speech' : 'dashboard');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Discours MJ — texte du personnage
  if (view === 'speech' && pendingMJ && speech) {
    return (
      <div className="mj-overlay">
        <div className="mj-overlay__inner">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
              Mode Maître du Jeu
            </span>
            <button
              style={{ color: 'var(--muted-light)', fontSize: 'var(--text-sm)', background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-2)' }}
              onClick={() => setView('dashboard')}
            >
              Dashboard →
            </button>
          </div>

          {/* Personnage */}
          <div className="mj-overlay__char-name">
            <span className="mj-overlay__char-emoji">{speech.characterEmoji}</span>
            <p className="mj-overlay__name-text">{speech.characterName}</p>
            <p style={{ color: 'var(--muted-light)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
              Lisez ce texte à voix haute
            </p>
          </div>

          {/* Texte du discours */}
          <div className="mj-overlay__speech">
            {speech.lines.map((line, i) => {
              if (line === '---') {
                return (
                  <div key={i} className="mj-overlay__separator">✦</div>
                );
              }
              const isBold = line.startsWith('**') && line.endsWith('**');
              return (
                <p
                  key={i}
                  className="mj-overlay__line"
                  style={{
                    fontWeight: isBold ? 'bold' : 'normal',
                    color: isBold ? 'var(--gold)' : 'var(--cream)',
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  {isBold ? line.slice(2, -2) : line}
                </p>
              );
            })}
          </div>

          {/* Validation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <button
              className="btn btn-gold"
              onClick={() => { completeMJSpeech(); }}
            >
              J'ai terminé — Continuer le jeu
            </button>
            <button className="btn btn-ghost" style={{ color: 'var(--muted-light)' }} onClick={goToGame}>
              Retour sans valider
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mode configuration (mise en place)
  if (view === 'setup') {
    return (
      <div className="mj-overlay" style={{ background: 'var(--charcoal)' }}>
        <div className="mj-overlay__inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
              Guide de mise en place
            </span>
            <button style={{ color: 'var(--muted-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-2)' }} onClick={() => setView('dashboard')}>
              ← Dashboard
            </button>
          </div>

          <p style={{ color: 'var(--muted-light)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
            Cachez les cartes aux emplacements indiqués avant la partie.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {MJ_SETUP_GUIDE.map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(245,240,232,0.05)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontWeight: 'bold', marginBottom: 'var(--space-1)', fontSize: 'var(--text-base)' }}>
                  {item.card}
                </p>
                <p style={{ color: 'var(--muted-light)', fontSize: 'var(--text-sm)' }}>
                  {item.location}
                </p>
              </div>
            ))}
          </div>

          <button className="btn btn-outline" style={{ borderColor: 'rgba(245,240,232,0.2)', color: 'var(--muted-light)' }} onClick={() => setView('dashboard')}>
            ← Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  // Marquer une carte comme trouvée
  if (view === 'markCard') {
    const clubCards = CARDS.filter(c => c.type === 'currency');
    const redCards = CARDS.filter(c => c.type === 'redHerring');

    return (
      <div className="mj-overlay" style={{ background: 'var(--charcoal)' }}>
        <div className="mj-overlay__inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
              Marquer une carte
            </span>
            <button style={{ color: 'var(--muted-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-2)' }} onClick={() => setView('dashboard')}>
              ← Retour
            </button>
          </div>
          <p style={{ color: 'var(--muted-light)', fontSize: 'var(--text-sm)' }}>
            Marquer une carte comme trouvée (trèfles et fausses pistes uniquement).
          </p>

          <div>
            <p style={{ color: 'var(--gold)', fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Trèfles</p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {clubCards.map(c => {
                const found = game.foundClubs.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => !found && mjMarkCard(c.id)}
                    style={{
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${found ? 'var(--gold)' : 'rgba(245,240,232,0.2)'}`,
                      background: found ? 'rgba(201,168,76,0.2)' : 'transparent',
                      color: found ? 'var(--gold)' : 'var(--muted-light)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'var(--text-base)',
                      cursor: found ? 'default' : 'pointer',
                    }}
                  >
                    {c.rank}♣ {found ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p style={{ color: 'var(--gold)', fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Fausses pistes</p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {redCards.map(c => {
                const found = game.discoveredCards.includes(c.id);
                const sym = SUIT_SYMBOLS[c.suit];
                return (
                  <button
                    key={c.id}
                    onClick={() => !found && mjMarkCard(c.id)}
                    style={{
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${found ? 'var(--gold)' : 'rgba(245,240,232,0.2)'}`,
                      background: found ? 'rgba(201,168,76,0.2)' : 'transparent',
                      color: found ? 'var(--gold)' : 'var(--muted-light)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'var(--text-base)',
                      cursor: found ? 'default' : 'pointer',
                    }}
                  >
                    {c.rank}{sym} {found ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard principal MJ
  const balance = getClubBalance(game);
  const expectedCard = getExpectedCard(game);

  return (
    <div className="mj-overlay" style={{ background: 'rgba(28,28,26,0.98)' }}>
      <div className="mj-overlay__inner">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', color: 'var(--gold)', fontWeight: 'bold' }}>
            🎭 Maître du Jeu
          </span>
          <button
            className="btn btn-ghost"
            style={{ color: 'var(--muted-light)', width: 'auto', minHeight: 'auto', padding: 'var(--space-2) var(--space-3)', textTransform: 'none', fontWeight: 400 }}
            onClick={goToGame}
          >
            ← Retour au jeu
          </button>
        </div>

        {/* Alerte discours en attente */}
        {pendingMJ && speech && (
          <div
            style={{ background: 'rgba(201,168,76,0.15)', border: '2px solid var(--gold)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', cursor: 'pointer' }}
            onClick={() => setView('speech')}
          >
            <p style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
              ⚡ Discours en attente
            </p>
            <p style={{ color: 'var(--muted-light)', fontSize: 'var(--text-sm)' }}>
              {speech.characterName} doit parler → Tapez ici
            </p>
          </div>
        )}

        {/* État de la partie */}
        <div style={{ background: 'rgba(245,240,232,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            État de la partie
          </p>
          <StatusRow label="Phase" value={game.phase} />
          <StatusRow label="Carte attendue" value={expectedCard ?? '—'} />
          <StatusRow label="Trèfles" value={`${balance} dispo (${game.spentClubs} dépensés)`} />
          <StatusRow label="Jardin" value={game.gardenUnlocked ? '✓ Ouvert' : '✗ Fermé'} />
          <StatusRow label="Bureau" value={game.bureauUnlocked ? '✓ Ouvert' : '✗ Fermé'} />
          <StatusRow label="Monnaie identifiée" value={game.currencyIdentified ? '✓' : '✗'} />
          <StatusRow label="Cartes découvertes" value={game.discoveredCards.join(', ') || 'Aucune'} />
          <StatusRow label="Trèfles trouvés" value={game.foundClubs.join(', ') || 'Aucun'} />
          {game.earlyCards.length > 0 && (
            <StatusRow label="⚠ Cartes trop tôt" value={game.earlyCards.join(', ')} highlight />
          )}
        </div>

        {/* Actions d'urgence */}
        <div>
          <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
            Actions
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <button className="btn btn-gold btn-sm" onClick={mjForceNext}>
              ⏭ Débloquer l'étape suivante
            </button>
            <button className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(245,240,232,0.2)', color: 'var(--cream)' }} onClick={mjAddFiveClubs}>
              ♣ Ajouter 5 trèfles
            </button>
            <button className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(245,240,232,0.2)', color: 'var(--cream)' }} onClick={() => setView('markCard')}>
              🃏 Marquer une carte trouvée
            </button>
            <button className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(245,240,232,0.2)', color: 'var(--cream)' }} onClick={() => setView('setup')}>
              📋 Guide de mise en place
            </button>
            <button className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(139,26,26,0.5)', color: 'var(--crimson)' }} onClick={() => setShowResetConfirm(true)}>
              🔄 Réinitialiser la partie
            </button>
          </div>
        </div>

        <ConfirmDialog
          open={showResetConfirm}
          title="Réinitialiser ?"
          message="Êtes-vous certain de vouloir effacer toute la progression ? Cette action est irréversible."
          confirmLabel="RECOMMENCER"
          cancelLabel="Annuler"
          danger
          onConfirm={() => { setShowResetConfirm(false); mjReset(); }}
          onCancel={() => setShowResetConfirm(false)}
        />
      </div>
    </div>
  );
}

function StatusRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
      <span style={{ color: 'var(--muted-light)', fontSize: 'var(--text-sm)', flexShrink: 0 }}>{label}</span>
      <span style={{
        color: highlight ? 'var(--crimson)' : 'var(--cream)',
        fontSize: 'var(--text-sm)',
        fontWeight: highlight ? 700 : 400,
        textAlign: 'right',
        wordBreak: 'break-all',
      }}>
        {value}
      </span>
    </div>
  );
}