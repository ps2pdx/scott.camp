import type { ReactNode } from 'react';
import { Label } from '@/components/Label';
import { width } from '@/components/Grid';
import s from './sections.module.css';

export function Block({ label, note, first, part, children }: { label: string; note?: string; first?: boolean; part?: string; children: ReactNode }) {
  return (
    <div className={`${s.sub} ${first ? '' : s.block}`} {...(part ? { 'data-part': part } : {})}>
      <Label>{label}</Label>
      {note ? <p className={`transcript muted ${width.text}`}>{note}</p> : null}
      {children}
    </div>
  );
}
