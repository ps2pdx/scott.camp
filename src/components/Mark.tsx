import s from './Mark.module.css';

export type MarkData = { src: string; width: number; height: number; name: string; wide?: boolean };

export function Mark({ mark }: { mark: MarkData }) {
  return <img data-part="mark" className={`${s.mark} ${mark.wide ? s.wide : ''}`} src={mark.src} width={mark.width} height={mark.height} alt={mark.name} aria-label={mark.name} decoding="async" />;
}

export type PortraitData = { src: string; srcSet: string; width: number; height: number; alt: string; caption: string };

export function Portrait({ p, part = 'portrait', wide }: { p: PortraitData; part?: string; wide?: boolean }) {
  return (
    <figure data-part={part} className={s.portrait}>
      <img className={`${s.portraitTile} ${wide ? s.wideTile : ''}`} src={p.src} srcSet={p.srcSet} sizes={wide ? '(max-width: 639px) 100vw, 640px' : '(max-width: 639px) 240px, 320px'} width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />
      <figcaption className="meta">{p.caption}</figcaption>
    </figure>
  );
}
