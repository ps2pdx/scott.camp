import type { ReactNode } from 'react';
import { Label } from './Label';
import { RunningHead } from './RunningHead';
import s from './Section.module.css';

export function Section({ id, runningHead, eyebrow, title, lead, surface = 'page', first, children }: {
  id: string; runningHead: string; eyebrow?: string; title?: string; lead?: string; surface?: 'page' | 'board' | 'endpaper'; first?: boolean; children: ReactNode;
}) {
  return (
    <section id={id} {...(first ? { 'data-first': '' } : {})} {...(surface === 'endpaper' ? { 'data-surface': 'endpaper' } : {})} className={`grain ${surface === 'board' ? `tex-board ${s.board}` : surface === 'endpaper' ? `tex-paper ${s.endpaper}` : 'tex-paper'} ${s.section} ${first ? 'first' : 'cut'}`}>
      <div className={s.wrap}>
        <div className={s.head}>
          <div className={s.titles}>
            {eyebrow ? <Label>{eyebrow}</Label> : null}
            {title ? <h2 className="display t-title">{title}</h2> : null}
            {lead ? <p className="text t-lead muted">{lead}</p> : null}
          </div>
          <RunningHead>{runningHead}</RunningHead>
        </div>
        {children}
      </div>
    </section>
  );
}

export function SectionBody({ children }: { children: ReactNode }) {
  return <div data-part="section-body" className={`grain tex-paper ${s.section} cut`}><div className={s.wrap}>{children}</div></div>;
}
