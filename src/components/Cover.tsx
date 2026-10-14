import { COPY } from '@/content/copy';
import { Label } from './Label';
import s from './Cover.module.css';

export function Cover({ id, compact }: { id?: string; compact?: boolean }) {
  const h = COPY.hero;
  const Tag = compact ? 'div' : 'section';
  return (
    <Tag {...(id ? { id } : {})} data-part="cover" className={`chip ${s.cover} ${compact ? s.compact : ''}`}>
      <div className={s.top}><Label>{h.eyebrow}</Label><span data-part="title-line" className={`meta ${s.name}`}>{h.titleLine}</span></div>
      <div className={s.foot}>
        {compact ? <div className={`display t-display bleed-btn ${s.headline}`}>{h.headline}</div> : <h1 className={`display t-display bleed-btn ${s.headline}`}>{h.headline}</h1>}
      </div>
    </Tag>
  );
}
