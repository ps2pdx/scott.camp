import type { ReactNode } from 'react';
import { EvidenceVideo, type EvidenceClip } from './EvidenceVideo';
import { width } from './Grid';
import s from './Evidence.module.css';

export type Ratio = '3:2' | '2:3' | '1:1' | '16:9';
export type Focus = 'top' | 'bottom' | 'left' | 'right';
export type Still = { src: string; srcSet: string; width: number; height: number; ratio: Ratio; focus?: Focus; caption: string; alt: string };

export const SIZES = { figure: '(max-width: 1023px) 100vw, 720px', portrait: '(max-width: 639px) 240px, 360px' } as const;

export function Shot({ e, sizes, className }: { e: Omit<Still, 'caption'>; sizes?: string; className?: string }) {
  return <img className={`${s.shot} ${className ?? ''}`} data-ratio={e.ratio} {...(e.focus ? { 'data-focus': e.focus } : {})} src={e.src} srcSet={e.srcSet} {...(sizes ? { sizes } : {})} width={e.width} height={e.height} alt={e.alt} loading="lazy" decoding="async" />;
}

export const frame = s.frame;
export const plateFrame = `${s.frame} ${s.plate}`;

export function Figure({ caption, part, fill, media: extra, children }: { caption: string; part?: string; fill?: boolean; media?: string; children: ReactNode }) {
  return (
    <figure className={`${s.under} ${width.figure}`} {...(part ? { 'data-part': part } : {})}>
      <div className={`${s.frame} ${extra ?? ''} ${fill ? s.fill : ''}`}>{children}</div>
      <figcaption className="meta">{caption}</figcaption>
    </figure>
  );
}

export function Plate({ e, sizes = SIZES.figure }: { e: Still; sizes?: string }) {
  return <Figure caption={e.caption}><Shot e={e} sizes={sizes} /></Figure>;
}

export function Spin({ clip }: { clip: EvidenceClip & { caption: string } }) {
  return <Figure caption={clip.caption} media={s.spin}><div className={s.spinStage}><EvidenceVideo clip={clip} className={s.spinMedia} /></div></Figure>;
}
