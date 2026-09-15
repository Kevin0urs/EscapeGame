import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const SUSPECTS = ['Firmin', 'Armand', 'Béatrice', 'Personne'];

export function AccusationScreen() {
  const { solveAccusation } = useGameStore();
  const [chosen, setChosen] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  function handleChoice(suspect: string) {
    setChosen(suspect);
    if (suspect === 'Armand') {
      setResult('correct');
      setTimeout(() => solveAccusation(), 2500);
    } else {
      setResult('wrong');
      setTimeout(() => { setResult(null); setChosen(null); }, 2000);
    }
  }

  return (
    <div className="screen-pad">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)', animation: 'slideDown 300ms ease' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-3xl)', color: 'var(--charcoal)', marginBottom: 'var(--space-3)' }}>
          Qui a tué Béatrice ?
        </h2>
        <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
          Il est temps de désigner le coupable.
        </p>
      </div>

      {result === 'correct' && (
        <div className="revelation-block" style={{ marginBottom: 'var(--space-5)', animation: 'cardReveal 500ms ease' }}>
          <h2 style={{ color: 'var(--gold)', marginBottom: 'var(--space-2)' }}>AFFAIRE RÉSOLUE</h2>
          <p style={{ color: 'var(--cream)' }}>Armand de Carreau est le coupable.</p>
        </div>
      )}

      {result === 'wrong' && (
        <div style={{
          padding: 'var(--space-4)',
          background: 'var(--crimson)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          marginBottom: 'var(--space-5)',
          animation: 'shake 400ms ease',
        }}>
          <p style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)' }}>
            Ce n'est pas la bonne réponse.
          </p>
        </div>
      )}

      {!result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {SUSPECTS.map((suspect) => (
            <button
              key={suspect}
              className="btn btn-outline"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-xl)',
                justifyContent: 'flex-start',
                paddingLeft: 'var(--space-5)',
                borderWidth: 2,
                background: chosen === suspect ? 'var(--charcoal)' : 'var(--surface-raised)',
                color: chosen === suspect ? 'var(--cream)' : 'var(--ink)',
              }}
              onClick={() => handleChoice(suspect)}
            >
              {suspect}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}