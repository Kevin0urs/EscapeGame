import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { SUIT_SYMBOLS, SUIT_NAMES_FR } from '../engine/cards';
import type { Suit, Rank } from '../engine/types';

const SUITS: Suit[] = ['diamond', 'heart', 'spade', 'club'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const isRed = (s: Suit) => s === 'diamond' || s === 'heart';

export function CardInputScreen() {
  const { goToGame, submitCard } = useGameStore();
  const [suit, setSuit] = useState<Suit | null>(null);
  const [rank, setRank] = useState<Rank | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'ok' | 'warn' | 'error'>('ok');

  function handleValidate() {
    if (!suit || !rank) return;

    const result = submitCard(suit, rank);

    if (result.type === 'not_found') {
      setFeedback("Cette carte n'existe pas dans ce jeu.");
      setFeedbackType('error');
      return;
    }

    if (result.type === 'already_found') {
      setFeedback('Cette carte a déjà été enregistrée.');
      setFeedbackType('warn');
      return;
    }

    if (result.type === 'currency_duplicate') {
      setFeedback('Cette carte a déjà été trouvée.');
      setFeedbackType('warn');
      return;
    }

    if (result.type === 'early') {
      setFeedback('PREUVE ENREGISTRÉE\n\nCette carte semble importante…\n\nMais vous ne pouvez pas encore comprendre ce qu\'elle signifie.\n\nContinuez votre enquête.');
      setFeedbackType('warn');
      return;
    }

    // Pour tout résultat valide, retourner au jeu (la révélation sera affichée)
    goToGame();
  }

  if (feedback) {
    const isWarn = feedbackType === 'warn';
    const isError = feedbackType === 'error';
    return (
      <div style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        minHeight: '100vh',
        background: isWarn ? 'var(--charcoal)' : 'var(--bg)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {isWarn && (
          <div style={{ fontSize: '3rem', color: 'var(--gold)' }}>⚠</div>
        )}
        {feedback.split('\n').map((line, i) => (
          line ? (
            <p key={i} style={{
              fontFamily: i === 0 ? 'var(--font-serif)' : 'var(--font-sans)',
              fontSize: i === 0 ? 'var(--text-xl)' : 'var(--text-base)',
              fontWeight: i === 0 ? 'bold' : 'normal',
              color: isWarn ? 'var(--cream)' : (isError ? 'var(--crimson)' : 'var(--ink)'),
              maxWidth: 320,
            }}>
              {line}
            </p>
          ) : null
        ))}
        <button
          className="btn btn-gold"
          style={{ marginTop: 'var(--space-4)', maxWidth: 280, width: '100%' }}
          onClick={goToGame}
        >
          Continuer l'enquête
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <header className="app-header">
        <button className="btn btn-ghost" style={{ color: 'var(--muted-light)', padding: 0, minHeight: 'auto', width: 'auto', textTransform: 'none', fontWeight: 400 }} onClick={goToGame}>
          ← Retour
        </button>
        <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontSize: 'var(--text-base)' }}>
          Ajouter une carte
        </span>
        <span style={{ width: 60 }} />
      </header>

      <div className="card-input-screen">
        {/* Étape 1 : Famille */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-3)' }}>
            1 — Famille
          </p>
          <div className="suit-grid">
            {SUITS.map((s) => (
              <button
                key={s}
                className={`suit-btn ${suit === s ? 'suit-btn--selected' : ''}`}
                onClick={() => setSuit(s)}
                aria-label={SUIT_NAMES_FR[s]}
              >
                <span
                  className="suit-btn__symbol"
                  style={{ color: isRed(s) ? 'var(--suit-red)' : 'var(--suit-black)' }}
                >
                  {SUIT_SYMBOLS[s]}
                </span>
                <span className="suit-btn__name">{SUIT_NAMES_FR[s]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Étape 2 : Valeur */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-3)' }}>
            2 — Valeur
          </p>
          <div className="rank-grid">
            {RANKS.map((r) => (
              <button
                key={r}
                className={`rank-btn ${rank === r ? 'rank-btn--selected' : ''}`}
                onClick={() => setRank(r)}
                aria-label={r}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Aperçu + validation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {suit && rank && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-3)',
              background: 'var(--surface-raised)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--gold)',
              animation: 'fadeIn 200ms ease',
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 'bold',
                color: isRed(suit) ? 'var(--suit-red)' : 'var(--suit-black)',
              }}>
                {rank}
              </span>
              <span style={{
                fontSize: 'var(--text-2xl)',
                color: isRed(suit) ? 'var(--suit-red)' : 'var(--suit-black)',
              }}>
                {SUIT_SYMBOLS[suit]}
              </span>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleValidate}
            disabled={!suit || !rank}
          >
            Valider la carte
          </button>
        </div>
      </div>
    </div>
  );
}