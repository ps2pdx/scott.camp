import { Children, type ReactNode } from 'react';
import s from './Grid.module.css';

export const span = { text: s.text, figure: s.figure, note: s.note, half: s.half, portrait: s.portrait, opener: s.opener, margin: s.margin } as const;
export const width = { text: s['w-text'], rows: s['w-rows'] } as const;
export const content = s.content;

export function Grid({ columns, children, className, part }: { columns: 2 | 3 | 12; children: ReactNode; className?: string; part?: string }) {
  if (columns === 12) return <div className={`${s.cols} ${className ?? ''}`} {...(part ? { 'data-part': part } : {})}>{children}</div>;
  const items = Children.toArray(children);
  return (
    <div className={`${s.grid} ${columns === 2 ? s.two : s.three}`}>
      {items.map((c, i) => <div key={i} data-part="cell" {...(columns === 3 && items.length === 4 && i === 3 ? { 'data-span': '' } : {})} className={`cell ${s.cell} ${columns === 3 && items.length === 4 && i === 3 ? `span ${s.span}` : ''}`}>{c}</div>)}
      {(columns === 3 && items.length % 3 === 2) || (columns === 2 && items.length % 2 === 1) ? <div data-part="filler" aria-hidden="true" className={`${s.cell} ${s.filler}`} /> : null}
    </div>
  );
}
