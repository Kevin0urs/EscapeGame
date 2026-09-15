import { useGameStore } from '../store/gameStore';
import { CARD_REVEAL_CONTENT } from '../engine/scenario';
import { getCardById, SUIT_SYMBOLS } from '../engine/cards';
import type { DiscoverResult } from '../engine/progression';

interface Props {
  reveal: { cardId: string; result: DiscoverResult };
}

const isRed = (suit: string) => suit === 'diamond' || suit === 'heart';

export function CardRevealScreen({ reveal }: Props) {
  const { dismissReveal } = useGameStore();
  const { cardId, result } = reveal;
  const card = getCardById(cardId);
  const revealContent = CARD_REVEAL_CONTENT[cardId];

  if (!card) {
    return (
      <div className="reveal-screen">
        <button className="btn btn-gold" onClick={dismissReveal}>Continuer</button>
      </div>
    );
  }

  const suitSymbol = SUIT_SYMBOLS[card.suit];
  const red = isRed(card.suit);

  // Écran trèfle (plus court)
  if (result.type === 'currency_added') {
    const { value, newBalance } = result as { type: 'currency_added'; cardId: string; value: number; newBalance: number };
    return (
      <div className="reveal-screen" style={{ gap: 'var(--space-5)' }}>
        <p className="reveal-screen__label">Trèfle trouvé</p>

        <div className="reveal-card" style={{ animation: 'cardReveal 400ms cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
          <span className="reveal-card__rank" style={{ color: 'var(--suit-black)' }}>{card.rank}</span>
          <span className="reveal-card__suit" style={{ color: 'var(--suit-black)', fontSize: '3rem' }}>{suitSymbol}</span>
        </div>

        <div style={{ textAlign: 'center', animation: 'slideUp 350ms 300ms ease both' }}>
          <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>
            +{value} ♣
          </p>
          <p style={{ color: 'var(--muted-light)', marginTop: 'var(--space-2)' }}>
            Solde : {newBalance} trèfle{newBalance !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          className="btn btn-gold"
          style={{ maxWidth: 280, width: '100%', animation: 'slideUp 350ms 500ms ease both' }}
          onClick={dismissReveal}
        >
          Continuer
        </button>
      </div>
    );
  }

  // Fausse piste ou carte principale
  const title = revealContent?.title ?? card.rank + suitSymbol;
  const playerLines = revealContent?.playerLines ?? [];

  return (
    <div className="reveal-screen">
      <p className="reveal-screen__label">
        {card.type === 'redHerring' ? 'Indice trouvé' : 'Carte identifiée'}
      </p>

      {/* Grande carte */}
      <div className="reveal-card">
        <span className={`reveal-card__rank ${red ? 'red' : 'black'}`}>{card.rank}</span>
        <span className={`reveal-card__suit ${red ? 'red' : 'black'}`}>{suitSymbol}</span>
      </div>

      {/* Titre */}
      <h2 className="reveal-screen__title">{title}</h2>

      {/* Contenu */}
      {playerLines.length > 0 && (
        <div className="reveal-screen__content">
          {playerLines.map((line, i) => (
            <p key={i} style={{ color: 'rgba(245,240,232,0.75)', fontStyle: 'italic', marginBottom: 'var(--space-1)', fontFamily: 'var(--font-serif)' }}>
              {line}
            </p>
          ))}
        </div>
      )}

      <div className="reveal-screen__btn">
        <button className="btn btn-gold" onClick={dismissReveal}>
          Continuer l'enquête
        </button>
      </div>
    </div>
  );
}