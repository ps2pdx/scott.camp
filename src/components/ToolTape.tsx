import s from './ToolTape.module.css';

export function ToolTape({ items, className }: { items: readonly string[]; className?: string }) {
  const run = `${items.join(' · ')} · `;
  return (
    <div data-part="tools" className={`${s.tape} ${className ?? ''}`}>
      <ul className="sr-only" aria-label="Skills and tools">{items.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className={`meta ${s.viewport}`} aria-hidden="true">
        <div className={s.track}><span className={s.run}>{run}</span><span className={s.run}>{run}</span></div>
      </div>
    </div>
  );
}
