import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CHRONOLOGIE_EVENTS, CHRONOLOGIE_SUMMARY } from '../engine/scenario';

export function PuzzleChronologie() {
  const { solveChronologie } = useGameStore();

  // IDs dans l'ordre choisi par le joueur
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [solved, setSolved] = useState(false);

  // IDs disponibles (non encore placés)
  const availableIds = CHRONOLOGIE_EVENTS
    .map(e => e.id)
    .filter(id => !orderedIds.includes(id));

  // Mélangés au premier rendu (shuffle)
  const [shuffled] = useState(() => {
    const ids = CHRONOLOGIE_EVENTS.map(e => e.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  });

  const shuffledAvailable = shuffled.filter(id => availableIds.includes(id));

  function addEvent(id: string) {
    setError(false);
    setOrderedIds(prev => [...prev, id]);
  }

  function removeEvent(id: string) {
    setError(false);
    setOrderedIds(prev => prev.filter(x => x !== id));
  }

  function handleVerify() {
    const correctOrder = [...CHRONOLOGIE_EVENTS]
      .sort((a, b) => a.correctIndex - b.correctIndex)
      .map(e => e.id);

    const isCorrect = orderedIds.every((id, i) => id === correctOrder[i])
      && orderedIds.length === correctOrder.length;

    if (isCorrect) {
      setSolved(true);
      setTimeout(() => solveChronologie(), 3000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }

  if (solved) {
    return (
      <div className="screen-pad" style={{ textAlign: 'center' }}>
        <div className="revelation-block" style={{ marginBottom: 'var(--space-5)' }}>
          <h2 style={{ color: 'var(--gold)', marginBottom: 'var(--space-4)', fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)' }}>
            ✓ Histoire reconstituée
          </h2>
          {CHRONOLOGIE_SUMMARY.map((line, i) => (
            <p key={i} style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-2)', animation: `fadeIn 400ms ${i * 200}ms ease both` }}>
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="screen-pad">
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
        Reconstituez l'histoire
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
        Tapez les événements dans l'ordre chronologique.
      </p>

      {/* Zone ordonnée (réponse) */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-3)' }}>
          Votre ordre ({orderedIds.length}/{CHRONOLOGIE_EVENTS.length})
        </p>
        {orderedIds.length === 0 ? (
          <div style={{ padding: 'var(--space-4)', border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--muted-light)', fontStyle: 'italic' }}>
            Tapez un événement ci-dessous pour commencer
          </div>
        ) : (
          <div>
            {orderedIds.map((id, i) => {
              const ev = CHRONOLOGIE_EVENTS.find(e => e.id === id)!;
              return (
                <div
                  key={id}
                  className="chrono-event chrono-event--placed"
                  onClick={() => removeEvent(id)}
                  role="button"
                  aria-label={`Retirer : ${ev.label}`}
                >
                  <div className="chrono-event__number" style={{ background: 'var(--gold)', color: 'var(--charcoal)' }}>
                    {i + 1}
                  </div>
                  <span className="chrono-event__label" style={{ color: 'var(--cream)' }}>{ev.label}</span>
                  <span style={{ marginLeft: 'auto', color: 'rgba(245,240,232,0.5)', fontSize: 'var(--text-sm)' }}>×</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Événements disponibles */}
      {shuffledAvailable.length > 0 && (
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-3)' }}>
            Événements
          </p>
          {shuffledAvailable.map((id) => {
            const ev = CHRONOLOGIE_EVENTS.find(e => e.id === id)!;
            return (
              <div
                key={id}
                className="chrono-event"
                onClick={() => addEvent(id)}
                role="button"
                aria-label={`Placer : ${ev.label}`}
              >
                <div className="chrono-event__number" style={{ background: 'var(--paper-dark)', color: 'var(--muted)' }}>
                  {ev.id}
                </div>
                <span className="chrono-event__label">{ev.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Validation */}
      {orderedIds.length === CHRONOLOGIE_EVENTS.length && (
        <div style={{ animation: 'slideUp 300ms ease' }}>
          {error && (
            <p style={{ color: 'var(--crimson)', textAlign: 'center', marginBottom: 'var(--space-3)', fontWeight: 600, animation: 'shake 400ms ease' }}>
              L'ordre n'est pas correct. Regardez attentivement…
            </p>
          )}
          <button className="btn btn-gold" onClick={handleVerify}>
            Vérifier l'ordre
          </button>
        </div>
      )}

      {/* Hint */}
      <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--paper-dark)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', textAlign: 'center' }}>
          Tapez un événement placé pour le retirer.
        </p>
      </div>
    </div>
  );
}