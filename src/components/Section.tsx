import type { ReactNode } from 'react';
import { Label } from './Label';
import { RunningHead } from './RunningHead';
import { ToolTape } from './ToolTape';
import { Mark, type MarkData } from './Mark';
import s from './Section.module.css';

export function Section({ id, runningHead, eyebrow, title, lead, surface = 'page', first, tools, mark, children }: {
  tools?: readonly string[]; mark?: MarkData; id: string; runningHead?: string; eyebrow?: string; title?: string; lead?: string; surface?: 'page' | 'board' | 'endpaper'; first?: boolean; children: ReactNode;
}) {
  return (
    <section id={id} {...(first ? { 'data-first': '' } : {})} {...(surface === 'endpaper' ? { 'data-surface': 'endpaper' } : {})} className={`grain ${surface === 'board' ? `tex-board ${s.board}` : surface === 'endpaper' ? `tex-paper ${s.endpaper}` : 'tex-paper'} ${s.section} ${first ? 'first' : 'cut'}`}>
      {tools ? <ToolTape items={tools} /> : null}
      <div className={s.wrap}>
        <div className={s.head}>
          <div className={s.titles}>
            {eyebrow ? <Label>{eyebrow}</Label> : null}
            {title ? <h2 className="display t-title">{title}</h2> : null}
            {lead ? <p className="text muted">{lead}</p> : null}
          </div>
          {runningHead || mark ? <div className={s.side}>{runningHead ? <RunningHead>{runningHead}</RunningHead> : null}{mark ? <Mark mark={mark} /> : null}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

