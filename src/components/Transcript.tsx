import type { ReactNode } from 'react';
import type { TranscriptRow } from '@/content/copy';
import s from './Transcript.module.css';

function Row({ when, who, children }: { when: string; who?: string; children: ReactNode }) {
  return (
    <li className={s.row}>
      <span data-part="when" className={`when muted ${s.when}`}>{when}{who ? `\n${who}` : ''}</span>
      <span className={s.text}>{children}</span>
    </li>
  );
}

export function Transcript({ rows, tight, className, render }: { rows: readonly TranscriptRow[]; tight?: boolean; className?: string; render?: (row: TranscriptRow) => ReactNode }) {
  return (
    <ul className={`transcript ${s.list} ${tight ? s.tight : ''} ${className ?? ''}`}>
      {rows.map((r, i) => <Row key={i} when={r.when} who={r.who}>{render ? render(r) : r.text}</Row>)}
    </ul>
  );
}
Transcript.Row = Row;
