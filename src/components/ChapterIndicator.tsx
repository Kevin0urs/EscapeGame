import { getCurrentChapter } from '../engine/scenario';
import type { GamePhase } from '../engine/types';

interface Props {
  phase: GamePhase;
}

export function ChapterIndicator({ phase }: Props) {
  const chapter = getCurrentChapter(phase);
  return (
    <div className="chapter-bar">
      <span className="chapter-bar__number">CH. {chapter.number}</span>
      <span className="chapter-bar__title">{chapter.title}</span>
    </div>
  );
}