import { Figure } from './Evidence';
import s from './Mark.module.css';

export type MarkData = { src: string; width: number; height: number; name: string; wide?: boolean };

export function Mark({ mark }: { mark: MarkData }) {
  return <img data-part="mark" className={`${s.mark} ${mark.wide ? s.wide : ''}`} src={mark.src} width={mark.width} height={mark.height} alt={mark.name} aria-label={mark.name} decoding="async" />;
}

export type PortraitData = { src: string; srcSet: string; width: number; height: number; alt: string; caption: string };

export function Portrait({ p, part = 'portrait', wide }: { p: PortraitData; part?: string; wide?: boolean }) {
  return (
    <Figure caption={p.caption} part={part} layout={wide ? 'note' : 'under'} fill>
      <img className={s.portraitTile} src={p.src} srcSet={p.srcSet} sizes={wide ? '(max-width: 639px) 100vw, 760px' : '(max-width: 639px) 100vw, 360px'} width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />
    </Figure>
  );
}
