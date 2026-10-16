import { Figure, Shot, SIZES, type Still } from './Evidence';
import s from './Mark.module.css';

export type MarkData = { src: string; srcSet?: string; width: number; height: number; name: string; wide?: boolean };

export function Mark({ mark }: { mark: MarkData }) {
  return (
    <span data-part="mark" className={`${s.tile} ${mark.wide ? s.wide : ''}`}>
      <img className={s.mark} src={mark.src} {...(mark.srcSet ? { srcSet: mark.srcSet } : {})} width={mark.width} height={mark.height} alt={mark.name} loading="lazy" decoding="async" />
    </span>
  );
}

export function Portrait({ p, part = 'portrait', sizes = SIZES.portrait }: { p: Still; part?: string; sizes?: string }) {
  return (
    <Figure caption={p.caption} part={part} fill>
      <Shot e={p} sizes={sizes} />
    </Figure>
  );
}
