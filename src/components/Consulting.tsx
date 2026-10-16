import { COPY } from '@/content/copy';
import { Button } from './Button';
import { Label } from './Label';
import s from './Consulting.module.css';

export function Consulting({ className }: { className?: string }) {
  const c = COPY.contact.consulting;
  return (
    <div className={`${s.sheet} ${className ?? ''}`} data-part="booking">
      <Label>{c.eyebrow}</Label>
      <p className={`display t-display ${s.headline}`}>{c.headline}</p>
      <p className={`text ${s.text}`}>{c.text}</p>
      <div className={s.cta}><Button href={c.href} variant="primary" newTab>{c.label}</Button></div>
    </div>
  );
}
