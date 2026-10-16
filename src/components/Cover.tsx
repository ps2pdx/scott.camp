import { COPY } from '@/content/copy';
import { Label } from './Label';
import s from './Cover.module.css';

export function Cover({ id, compact }: { id?: string; compact?: boolean }) {
  const h = COPY.hero;
  const Tag = compact ? 'div' : 'section';
  return (
    <Tag {...(id ? { id } : {})} data-part="cover" className={`chip ${s.cover} ${compact ? s.compact : ''}`}>
      <div className={s.top}><Label>{h.eyebrow}</Label><span data-part="title-line" className={`meta ${s.name}`}>{h.titleLine}</span>
        {compact ? null : <div data-part="cover-links" className={`meta ${s.links}`}>{h.links.map((l) => 'newTab' in l ? <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}<span aria-hidden="true"> ↗</span></a> : <a key={l.href} href={l.href}>{l.label}</a>)}</div>}
      </div>
      <div className={s.foot}>
        {compact ? <div className={`display t-display bleed-btn ${s.headline}`}>{h.headline}</div> : <h1 className={`display t-display bleed-btn ${s.headline}`}>{h.headline}</h1>}
      </div>
    </Tag>
  );
}
