import s from './ToolMark.module.css';

const SIZES = [72, 96, 128, 160] as const;
const OFFSETS = [24, 48, 72, 96] as const;

function fnv(id: string) {
  let x = 2166136261;
  for (const c of id) x = Math.imul(x ^ c.charCodeAt(0), 16777619) >>> 0;
  return x;
}

export function watermarkPlacement(id: string) {
  const h = fnv(id);
  return { size: SIZES[h % 4], offset: OFFSETS[(h >>> 3) % 4], start: h % 5 };
}

export function ToolMark({ id, items, className }: { id: string; items: readonly string[]; className?: string }) {
  const p = watermarkPlacement(id);
  const run = `${items.join(' · ')} · `;
  return (
    <div data-part="tools" data-size={p.size} data-offset={p.offset} data-start={p.start} className={`${s.wm} ${className ?? ''}`}>
      <ul className="sr-only" aria-label="Skills and tools">{items.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className={`watermark ${s.viewport}`} aria-hidden="true">
        <div className={s.track}><span className={s.run}>{run}</span><span className={s.run}>{run}</span></div>
      </div>
    </div>
  );
}
