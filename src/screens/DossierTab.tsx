import { useGameStore } from '../store/gameStore';
import { getUnlockedDossierEntries } from '../engine/progression';

export function DossierTab() {
  const { game } = useGameStore();
  const entries = getUnlockedDossierEntries(game);

  // Séparer suspects/victimes des révélations
  const baseEntries = entries.filter(e => ['victime', 'suspect', 'temoin'].includes(e.id));
  const revealEntries = entries.filter(e => !['victime', 'suspect', 'temoin', 'fausse_piste_7s', 'fausse_piste_jh'].includes(e.id));
  const leadEntries = entries.filter(e => ['fausse_piste_7s', 'fausse_piste_jh'].includes(e.id));

  return (
    <div className="screen-pad">
      <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-2xl)' }}>
        Dossier d'enquête
      </h2>

      {/* Personnes */}
      <section style={{ marginBottom: 'var(--space-6)' }}>
        <p className="section-title">Personnes</p>
        {baseEntries.map(entry => (
          <div key={entry.id} className="dossier-entry">
            <p className="dossier-entry__title">{entry.title}</p>
            <p className="dossier-entry__content">{entry.content}</p>
          </div>
        ))}
      </section>

      {/* Révélations */}
      {revealEntries.length > 0 && (
        <section style={{ marginBottom: 'var(--space-6)' }}>
          <p className="section-title">Révélations</p>
          {revealEntries.map(entry => (
            <div key={entry.id} className="dossier-entry" style={{ borderLeftColor: 'var(--crimson)' }}>
              <p className="dossier-entry__title">{entry.title}</p>
              <p className="dossier-entry__content">{entry.content}</p>
            </div>
          ))}
        </section>
      )}

      {/* Fausses pistes */}
      {leadEntries.length > 0 && (
        <section style={{ marginBottom: 'var(--space-6)' }}>
          <p className="section-title">Pistes</p>
          {leadEntries.map(entry => (
            <div key={entry.id} className="dossier-entry" style={{ borderLeftColor: 'var(--muted)' }}>
              <p className="dossier-entry__title">{entry.title}</p>
              <p className="dossier-entry__content">{entry.content}</p>
            </div>
          ))}
        </section>
      )}

      {entries.length <= 3 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--muted)', fontStyle: 'italic' }}>
          <p>Le dossier se remplira au fil de votre enquête…</p>
        </div>
      )}
    </div>
  );
}