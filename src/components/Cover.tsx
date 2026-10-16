import { COPY } from '@/content/copy';
import { Label } from './Label';
import s from './Cover.module.css';

export function Cover({ id, compact, chapter }: { id?: string; compact?: boolean; chapter?: { label: string; title: string } }) {
  const h = COPY.hero;
  const Tag = compact ? 'div' : 'section';
  const headline = chapter ? chapter.title : h.headline;
  return (
    <Tag {...(id ? { id } : {})} data-part="cover" {...(chapter ? { 'data-chapter': '' } : {})} className={`chip ${s.cover} ${compact ? s.compact : ''} ${chapter ? s.chapter : ''}`}>
      <div className={s.top}><Label>{chapter ? chapter.label : h.eyebrow}</Label><span data-part="title-line" className={`meta ${s.name}`}>{h.titleLine}</span>
        {compact ? null : <div data-part="cover-links" className={`meta ${s.links}`}>{h.links.map((l) => 'newTab' in l ? <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}<span aria-hidden="true"> ↗</span></a> : <a key={l.href} href={l.href}>{l.label}</a>)}</div>}
      </div>
      <div className={s.foot}>
        {compact ? <div className={`display t-display bleed-btn ${s.headline}`}>{headline}</div> : <h1 className={`display t-display bleed-btn ${s.headline}`}>{headline}</h1>}
      </div>
    </Tag>
  );
}
