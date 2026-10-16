import type { ReactNode } from 'react';
import { Label } from './Label';
import { RunningHead } from './RunningHead';
import { ToolMark, watermarkPlacement } from './ToolMark';
import { Mark, type MarkData } from './Mark';
import { content, span } from './Grid';
import g from './Grid.module.css';
import s from './Section.module.css';

export function Section({ id, runningHead, eyebrow, title, lead, figure, surface = 'page', first, tools, mark, children }: {
  figure?: ReactNode;
  tools?: readonly string[]; mark?: MarkData; id: string; runningHead?: string; eyebrow?: string; title?: string; lead?: string; surface?: 'page' | 'board' | 'endpaper'; first?: boolean; children: ReactNode;
}) {
  const wm = tools ? watermarkPlacement(id) : null;
  const brow = eyebrow && eyebrow !== runningHead ? eyebrow : null;
  const hasHead = Boolean(title || lead || figure || brow || runningHead || mark);
  return (
    <section id={id} {...(wm ? { 'data-wm-size': wm.size, 'data-wm-offset': wm.offset } : {})} {...(first ? { 'data-first': '' } : {})} {...(surface === 'endpaper' ? { 'data-surface': 'endpaper' } : {})} className={`grain ${surface === 'board' ? `tex-board ${s.board}` : surface === 'endpaper' ? `tex-paper ${s.endpaper}` : 'tex-paper'} ${s.section} ${wm ? s.hasWm : ''} ${first ? 'first' : 'cut'}`}>
      <div className={`${content} ${s.wrap}`}>
        {hasHead ? (
          <div className={`${g.cols} ${s.head}`}>
            <div className={`${g.cols} ${s.titles}`}>
              {title ? <h2 className={`display t-title ${span.text}`}>{title}</h2> : null}
              {figure}
              {lead ? <p className={`text ${span.text}`}>{lead}</p> : null}
            </div>
            {brow || runningHead || mark ? <div className={s.side} data-part="margin"><div className={s.marginText}>{brow ? <Label>{brow}</Label> : null}{runningHead ? <RunningHead>{runningHead}</RunningHead> : null}</div>{mark ? <Mark mark={mark} /> : null}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
      {tools ? <ToolMark id={id} items={tools} /> : null}
    </section>
  );
}
