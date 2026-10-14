import { Children, type ReactNode } from 'react';
import s from './Grid.module.css';
export function Grid({ columns, children }: { columns: 2 | 3; children: ReactNode }) {
  const items = Children.toArray(children);
  return (
    <div className={`${s.grid} ${columns === 2 ? s.two : s.three}`}>
      {items.map((c, i) => <div key={i} data-part="cell" {...(columns === 3 && items.length === 4 && i === 3 ? { 'data-span': '' } : {})} className={`cell ${s.cell} ${columns === 3 && items.length === 4 && i === 3 ? `span ${s.span}` : ''}`}>{c}</div>)}
      {columns === 3 && items.length % 3 === 2 ? <div data-part="filler" aria-hidden="true" className={`${s.cell} ${s.filler}`} /> : null}
    </div>
  );
}
