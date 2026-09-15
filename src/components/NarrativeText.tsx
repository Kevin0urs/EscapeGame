interface Props {
  lines: string[];
  className?: string;
  delay?: number; // ms de délai avant apparition de chaque ligne
}

/**
 * Affiche des lignes de texte narratif.
 * Les lignes "---" sont rendues comme séparateurs décoratifs.
 * Les lignes commençant par "**" et finissant par "**" sont en gras.
 */
export function NarrativeText({ lines, className = '', delay = 0 }: Props) {
  return (
    <div className={`narrative-block ${className}`}>
      {lines.map((line, i) => {
        if (line === '---') {
          return (
            <div key={i} className="narrative-separator">
              ✦ ✦ ✦
            </div>
          );
        }

        // Gras
        const boldMatch = line.match(/^\*\*(.+)\*\*$/);
        if (boldMatch) {
          return (
            <p key={i} className="narrative-emphasis" style={{ animationDelay: `${delay + i * 80}ms` }}>
              {boldMatch[1]}
            </p>
          );
        }

        return (
          <p key={i} style={{ animationDelay: `${delay + i * 60}ms` }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}