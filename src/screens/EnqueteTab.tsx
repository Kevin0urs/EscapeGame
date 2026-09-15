import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PHASE_CONTENT } from '../engine/scenario';
import { NarrativeText } from '../components/NarrativeText';
import { hasPendingMJSpeech, getClubBalance } from '../engine/progression';
import { PuzzleChronologie } from './PuzzleChronologie';
import { AccusationScreen } from './AccusationScreen';
import { EndScreen } from './EndScreen';

export function EnqueteTab() {
  const {
    game, goToCardInput,
  } = useGameStore();

  const { phase } = game;
  const content = PHASE_CONTENT[phase];
  const pendingMJ = hasPendingMJSpeech(game);
  const balance = getClubBalance(game);

  // Écrans spéciaux
  if (phase === 'chronologie') return <PuzzleChronologie />;
  if (phase === 'accusation') return <AccusationScreen />;
  if (phase === 'end') return <EndScreen />;

  return (
    <div className="screen-pad">
      {/* Titre de section */}
      {content.title && (
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)', color: 'var(--charcoal)', animation: 'slideUp 300ms ease' }}>
          {content.title}
        </h2>
      )}

      {/* Contenu joueur */}
      {content.playerLines.length > 0 && (
        <div className="card-surface" style={{ marginBottom: 'var(--space-4)', animation: 'slideUp 350ms ease' }}>
          <NarrativeText lines={content.playerLines} />
        </div>
      )}

      {/* Contenu spécifique par phase */}
      <PhaseSpecificContent phase={phase} pendingMJ={pendingMJ} balance={balance} />

      {/* Objectif actuel */}
      {!pendingMJ && content.objective && !isSpecialPhase(phase) && (
        <ObjectiveBlock
          objective={content.objective}
          hint={content.objectiveHint}
          showCardButton={isCardWaitingPhase(phase)}
          onAddCard={goToCardInput}
        />
      )}
    </div>
  );
}

function isSpecialPhase(phase: string) {
  return ['currency_puzzle', 'find_clubs', 'firmin_testimony', 'bureau_puzzle'].includes(phase);
}

function isCardWaitingPhase(phase: string) {
  return ['intro', 'find_kd', 'find_qd', 'find_ah', 'find_8h', 'find_10d', 'find_as'].includes(phase);
}

// ============================================================
// Contenu spécifique par phase
// ============================================================

interface PhaseProps {
  phase: string;
  pendingMJ: boolean;
  balance: number;
}

function PhaseSpecificContent({ phase, pendingMJ, balance }: PhaseProps) {
  const { solveCurrencyPuzzle, payFirmin, solveBureau, goToCardInput, game } = useGameStore();

  // --- Discours MJ en attente ---
  if (pendingMJ) {
    return <MJPendingBanner />;
  }

  // --- Énigme monnaie ---
  if (phase === 'currency_puzzle') {
    return <CurrencyPuzzle onSolve={solveCurrencyPuzzle} />;
  }

  // --- Paiement Firmin ---
  if (phase === 'find_clubs') {
    return (
      <FirminPaymentBlock
        balance={balance}
        onPay={() => payFirmin()}
        onAddCard={goToCardInput}
      />
    );
  }

  // --- Pliage (bureau puzzle) ---
  if (phase === 'bureau_puzzle') {
    return <BureauPuzzle onSolve={solveBureau} />;
  }

  // --- Tableau des comptes (après 10♦) ---
  if (phase === 'comptes_reveal' && !pendingMJ) {
    return <ComptesTable />;
  }

  return null;
}

// ============================================================
// Bannière MJ en attente
// ============================================================

function MJPendingBanner() {
  const { game } = useGameStore();
  const content = PHASE_CONTENT[game.phase];
  const charName = content.characterSpeech?.characterName ?? 'Le personnage';

  return (
    <div className="mj-banner" style={{ marginBottom: 'var(--space-4)' }}>
      <p style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-2)', fontWeight: 700 }}>
        Message
      </p>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', color: 'var(--cream)', marginBottom: 'var(--space-3)' }}>
        {charName} veut vous parler
      </h3>
      <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
        Allez voir le Maître du Jeu.
      </p>
      <div className="mj-banner__dots">
        <div className="mj-banner__dot" />
        <div className="mj-banner__dot" />
        <div className="mj-banner__dot" />
      </div>
      <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.05em' }}>
        Le MJ tape le logo 5 fois pour voir le texte.
      </p>
    </div>
  );
}

// ============================================================
// Objectif courant
// ============================================================

interface ObjectiveProps {
  objective: string;
  hint?: string;
  showCardButton: boolean;
  onAddCard: () => void;
}

function ObjectiveBlock({ objective, hint, showCardButton, onAddCard }: ObjectiveProps) {
  return (
    <div style={{ animation: 'slideUp 400ms 200ms ease both' }}>
      <div style={{
        background: 'var(--charcoal)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        marginBottom: 'var(--space-4)',
      }}>
        <p style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-2)', fontWeight: 700 }}>
          Objectif
        </p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', color: 'var(--cream)', marginBottom: hint ? 'var(--space-2)' : 0 }}>
          {objective}
        </h3>
        {hint && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(245,240,232,0.65)', fontStyle: 'italic' }}>
            {hint}
          </p>
        )}
      </div>

      {showCardButton && (
        <button className="btn btn-gold" onClick={onAddCard}>
          ✦ Ajouter une carte
        </button>
      )}
    </div>
  );
}

// ============================================================
// Énigme monnaie
// ============================================================

function CurrencyPuzzle({ onSolve }: { onSolve: () => void }) {
  const [answered, setAnswered] = useState<null | 'yes' | 'no'>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const VALID = ['trèfle', 'trefle', 'trèfles', 'trefles'];

  function handleAnswer(ans: 'yes' | 'no') {
    setAnswered(ans);
    setError('');
  }

  function handleSubmit() {
    const normalized = input.trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const validNorm = VALID.map(v =>
      v.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );
    if (validNorm.includes(normalized)) {
      onSolve();
    } else {
      setError("C'est pas ça !");
      setInput('');
    }
  }

  return (
    <div className="card-surface" style={{ animation: 'slideUp 300ms ease', marginBottom: 'var(--space-4)' }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-4)' }}>
        Avez-vous trouvé de l'argent ?
      </h3>

      {!answered && (
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAnswer('yes')}>
            OUI
          </button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleAnswer('no')}>
            NON
          </button>
        </div>
      )}

      {answered === 'no' && (
        <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--paper-dark)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
            Continuez de chercher.
          </p>
          <button className="btn btn-ghost" style={{ marginTop: 'var(--space-2)' }} onClick={() => setAnswered(null)}>
            ← Retour
          </button>
        </div>
      )}

      {answered === 'yes' && (
        <div style={{ marginTop: 'var(--space-3)' }}>
          <p style={{ marginBottom: 'var(--space-3)', fontFamily: 'var(--font-serif)' }}>
            Très bien. Complétez :
          </p>
          <p style={{ fontSize: 'var(--text-xl)', fontFamily: 'var(--font-serif)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
            1 sou = _____
          </p>
          <input
            className="input-field"
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="Votre réponse…"
            autoCapitalize="off"
            autoComplete="off"
          />
          {error && (
            <p style={{ color: 'var(--crimson)', marginTop: 'var(--space-2)', fontWeight: 600, animation: 'shake 400ms ease' }}>
              {error}
            </p>
          )}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSubmit}>
              Valider
            </button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAnswered(null)}>
              ←
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Paiement Firmin
// ============================================================

interface FirminProps {
  balance: number;
  onPay: () => boolean;
  onAddCard: () => void;
}

function FirminPaymentBlock({ balance, onPay, onAddCard }: FirminProps) {
  const canPay = balance >= 5;
  const [paying, setPaying] = useState(false);

  function handlePay() {
    setPaying(true);
    const ok = onPay();
    if (!ok) setPaying(false);
  }

  return (
    <div style={{ animation: 'slideUp 300ms ease' }}>
      <div className="card-surface" style={{ marginBottom: 'var(--space-4)', borderColor: 'rgba(201,168,76,0.4)', borderWidth: 2 }}>
        <p style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-2)', fontWeight: 700 }}>
          Interroger Firmin
        </p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
          Coût : 5 ♣
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--paper-dark)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: 'var(--text-2xl)', color: 'var(--suit-black)' }}>♣</span>
          <div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>Votre solde</p>
            <p style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: balance >= 5 ? 'var(--gold)' : 'var(--crimson)' }}>
              {balance} trèfle{balance !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {canPay ? (
          <button className="btn btn-gold" onClick={handlePay} disabled={paying}>
            Payer 5 ♣
          </button>
        ) : (
          <>
            <p style={{ color: 'var(--crimson)', fontStyle: 'italic', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
              Vous n'avez pas assez de trèfles. Continuez à chercher.
            </p>
            <button className="btn btn-outline" onClick={onAddCard}>
              ♣ Ajouter une carte de trèfle
            </button>
          </>
        )}
      </div>

      {!canPay && (
        <p style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', textAlign: 'center', fontStyle: 'italic' }}>
          Il vous faut {5 - balance} trèfle{5 - balance !== 1 ? 's' : ''} de plus.
        </p>
      )}
    </div>
  );
}

// ============================================================
// Puzzle Bureau (pliage 8♥)
// ============================================================

function BureauPuzzle({ onSolve }: { onSolve: () => void }) {
  const [folded, setFolded] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const VALID = ['bureau', 'le bureau'];

  function handleSubmit() {
    const normalized = input.trim().toLowerCase();
    if (VALID.includes(normalized)) {
      onSolve();
    } else {
      setError('Regardez attentivement ce que les plis rapprochent.');
      setInput('');
    }
  }

  return (
    <div className="card-surface" style={{ animation: 'slideUp 300ms ease', marginBottom: 'var(--space-4)' }}>
      {!folded ? (
        <>
          <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-3)' }}>
            Carte pliée
          </h3>
          <p style={{ color: 'var(--muted)', marginBottom: 'var(--space-4)', fontStyle: 'italic' }}>
            Cette carte semble avoir été conçue pour être manipulée. Pliez-la comme elle était à l'origine.
          </p>
          <button className="btn btn-primary" onClick={() => setFolded(true)}>
            J'ai plié la carte
          </button>
        </>
      ) : (
        <>
          <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-3)' }}>
            Quel lieu voyez-vous ?
          </h3>
          <input
            className="input-field"
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="Votre réponse…"
            autoCapitalize="off"
            autoComplete="off"
          />
          {error && (
            <p style={{ color: 'var(--crimson)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              {error}
            </p>
          )}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSubmit}>
              Valider
            </button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setFolded(false); setError(''); }}>
              ←
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Tableau des comptes (10♦)
// ============================================================

function ComptesTable() {
  return (
    <div className="card-surface" style={{ marginBottom: 'var(--space-4)', animation: 'slideUp 300ms ease' }}>
      <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 'bold', marginBottom: 'var(--space-3)', fontSize: 'var(--text-lg)' }}>
        Relevé des sommes
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-serif)' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '2px solid var(--border-strong)', fontSize: 'var(--text-sm)', color: 'var(--muted)', letterSpacing: '0.05em' }}>Année</th>
            <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '2px solid var(--border-strong)', fontSize: 'var(--text-sm)', color: 'var(--muted)', letterSpacing: '0.05em' }}>Montant</th>
          </tr>
        </thead>
        <tbody>
          {[1,2,3,4,5].map((year, i) => (
            <tr key={year}>
              <td style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 'var(--text-base)' }}>Année {year}</td>
              <td style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 'bold', fontSize: 'var(--text-base)' }}>
                {i + 2} ♣
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--paper-dark)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', fontStyle: 'italic' }}>
          Correspondance confirmée avec les cartes de trèfle.
        </p>
      </div>
    </div>
  );
}