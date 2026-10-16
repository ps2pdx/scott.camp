import s from './Mark.module.css';

export type MarkData = { src: string; width: number; height: number; name: string; wide?: boolean };

export function Mark({ mark }: { mark: MarkData }) {
  return <img data-part="mark" className={`${s.mark} ${mark.wide ? s.wide : ''}`} src={mark.src} width={mark.width} height={mark.height} alt={mark.name} aria-label={mark.name} decoding="async" />;
}

export type PortraitData = { src: string; srcSet: string; width: number; height: number; alt: string; caption: string };

export function Portrait({ p }: { p: PortraitData }) {
  return (
    <figure data-part="portrait" className={s.portrait}>
      <img className={s.portraitTile} src={p.src} srcSet={p.srcSet} sizes="(max-width: 639px) 96px, 120px" width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />
      <figcaption className="meta">{p.caption}</figcaption>
    </figure>
  );
}
