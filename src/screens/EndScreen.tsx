import { END_SCREEN_LINES } from '../engine/scenario';
import { useGameStore } from '../store/gameStore';

export function EndScreen() {
  const { goToHome } = useGameStore();
  const textLines = END_SCREEN_LINES.filter(l => l !== '---');
  const separatorIndices = new Set<number>();
  let offset = 0;
  END_SCREEN_LINES.forEach((l, i) => {
    if (l === '---') separatorIndices.add(i);
  });

  return (
    <div className="end-screen">
      <div style={{ animation: 'fadeIn 800ms ease' }}>
        <p style={{
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          fontWeight: 700,
          marginBottom: 'var(--space-4)',
          textAlign: 'center',
        }}>
          Message de Béatrice de Carreau
        </p>
      </div>

      <div className="end-screen__letter">
        {END_SCREEN_LINES.map((line, i) => {
          if (line === '---') {
            return (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  color: 'var(--gold)',
                  opacity: 0.4,
                  margin: 'var(--space-4) 0',
                  letterSpacing: '0.3em',
                  animationDelay: `${i * 150}ms`,
                }}
              >
                ✦
              </div>
            );
          }
          return (
            <p
              key={i}
              className="end-screen__line"
              style={{
                animationDelay: `${i * 150}ms`,
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {line}
            </p>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', animation: 'slideUp 800ms 3000ms ease both' }}>
        <p className="end-screen__fin">FIN</p>
      </div>

      <button
        className="btn btn-outline"
        style={{
          color: 'var(--muted-light)',
          borderColor: 'rgba(245,240,232,0.2)',
          maxWidth: 280,
          animation: 'fadeIn 600ms 5000ms ease both',
        }}
        onClick={goToHome}
      >
        Retour à l'accueil
      </button>
    </div>
  );
}