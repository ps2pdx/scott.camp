import type { ReactNode } from 'react';
import s from './Surface.module.css';
export type SurfaceKind = 'page' | 'board' | 'endpaper' | 'tech';
export function Surface({ kind, className, children }: { kind: SurfaceKind; className?: string; children: ReactNode }) {
  const tex = kind === 'board' ? 'tex-board' : 'tex-paper';
  return <div className={`grain ${tex} ${s[kind]} ${className ?? ''}`}>{children}</div>;
}
