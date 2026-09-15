import type { Suit } from '../engine/types';
import { SUIT_SYMBOLS } from '../engine/cards';

interface Props {
  suit: Suit;
  rank: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  sm: { rank: '1.4rem', suit: '1.1rem' },
  md: { rank: '2rem', suit: '1.6rem' },
  lg: { rank: '3rem', suit: '2.5rem' },
  xl: { rank: '4rem', suit: '3rem' },
};

const isRed = (suit: Suit) => suit === 'diamond' || suit === 'heart';

export function CardSymbol({ suit, rank, size = 'md' }: Props) {
  const sizeStyle = SIZE_MAP[size];
  const colorClass = isRed(suit) ? 'red' : 'black';

  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}
      aria-label={`${rank} de ${suit}`}
    >
      <span
        className={colorClass}
        style={{ fontSize: sizeStyle.rank, fontFamily: 'Georgia, serif', fontWeight: 'bold', lineHeight: 1, color: isRed(suit) ? 'var(--suit-red)' : 'var(--suit-black)' }}
      >
        {rank}
      </span>
      <span
        style={{ fontSize: sizeStyle.suit, lineHeight: 1, color: isRed(suit) ? 'var(--suit-red)' : 'var(--suit-black)' }}
      >
        {SUIT_SYMBOLS[suit]}
      </span>
    </span>
  );
}