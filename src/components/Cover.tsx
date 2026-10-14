import { COPY } from '@/content/copy';
import { Label } from './Label';
import { Button } from './Button';
import s from './Cover.module.css';

export function Cover({ id, compact }: { id?: string; compact?: boolean }) {
  const h = COPY.hero;
  const Tag = compact ? 'div' : 'section';
  return (
    <Tag {...(id ? { id } : {})} data-part="cover" className={`chip ${s.cover} ${compact ? s.compact : ''}`}>
      <Label>{h.eyebrow}</Label>
      <div className={s.foot}>
        {compact ? <div className={`display t-display bleed-btn ${s.headline}`}>{h.headline}</div> : <h1 className={`display t-display bleed-btn ${s.headline}`}>{h.headline}</h1>}
        <div className={s.btns}>
          <Button href={h.actions.email.href} variant="secondary">{h.actions.email.label}</Button>
          <Button href={h.actions.resume.href} variant="secondary" bracket={h.actions.resume.bracket} download>{h.actions.resume.label}</Button>
        </div>
      </div>
    </Tag>
  );
}
