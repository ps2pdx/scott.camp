import { COPY } from '@/content/copy';
import { SOCIAL_MARKS } from '@/content/socialMarks';
import { Label } from './Label';
import s from './Cover.module.css';

export function Cover({ id, compact, chapter }: { id?: string; compact?: boolean; chapter?: { title: string } }) {
  const h = COPY.hero;
  const Tag = compact ? 'div' : 'section';
  const headline = chapter ? chapter.title : h.headline;
  return (
    <Tag {...(id ? { id } : {})} data-part="cover" {...(chapter ? { 'data-chapter': '' } : {})} className={`chip ${s.cover} ${compact ? s.compact : ''} ${chapter ? s.chapter : ''}`}>
      {chapter ? null : <div className={s.top}><Label>{h.eyebrow}</Label><span data-part="title-line" className={`meta ${s.name}`}>{h.titleLine}</span></div>}
      {chapter || compact ? null : <div data-part="cover-links" className={`meta ${s.links}`}>{h.links.map((l) => 'newTab' in l ? <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}<span aria-hidden="true"> ↗</span></a> : <a key={l.href} href={l.href}>{l.label}</a>)}</div>}
      <div className={s.foot}>
        {compact ? <div className={`display t-display bleed-btn ${s.headline}`}>{headline}</div> : <h1 className={`display t-display bleed-btn ${s.headline}`}>{headline}</h1>}
        {chapter || compact ? null : <ul data-part="cover-socials" className={s.socials}>{COPY.socials.map((x) => (
          <li key={x.network}><a href={x.href} target="_blank" rel="noopener" aria-label={x.label} title={x.label}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={SOCIAL_MARKS[x.network]} /></svg></a></li>
        ))}</ul>}
      </div>
    </Tag>
  );
}
