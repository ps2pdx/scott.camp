import type { ReactNode } from 'react';
import { EvidenceVideo, type EvidenceClip } from './EvidenceVideo';
import { span } from './Grid';
import g from './Grid.module.css';
import s from './Evidence.module.css';

export type Still = { src: string; width: number; height: number; caption: string; alt: string };

export const frame = s.frame;
export const plateFrame = `${s.frame} ${s.plate}`;

export function Figure({ caption, layout = 'note', part, fill, media: extra, children }: { caption: string; layout?: 'note' | 'under'; part?: string; fill?: boolean; media?: string; children: ReactNode }) {
  const media = <div className={`${s.frame} ${extra ?? ''} ${fill ? s.fill : ''} ${layout === 'note' ? span.figure : ''}`}>{children}</div>;
  return (
    <figure className={layout === 'note' ? `${g.cols} ${s.fig}` : s.under} {...(part ? { 'data-part': part } : {})}>
      {media}
      <figcaption className={`meta ${layout === 'note' ? span.note : ''}`}>{caption}</figcaption>
    </figure>
  );
}

export function Plate({ e, layout }: { e: Still; layout?: 'note' | 'under' }) {
  return <Figure caption={e.caption} layout={layout}><img src={e.src} width={e.width} height={e.height} alt={e.alt} loading="lazy" decoding="async" /></Figure>;
}

export function Spin({ clip }: { clip: EvidenceClip & { caption: string } }) {
  return <Figure caption={clip.caption} media={s.spin}><div className={s.spinStage}><EvidenceVideo clip={clip} className={s.spinMedia} /></div></Figure>;
}
