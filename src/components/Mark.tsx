import s from './Mark.module.css';

export type MarkData = { src: string; width: number; height: number; name: string; wide?: boolean };

export function Mark({ mark }: { mark: MarkData }) {
  return <img data-part="mark" className={`${s.mark} ${mark.wide ? s.wide : ''}`} src={mark.src} width={mark.width} height={mark.height} alt={mark.name} aria-label={mark.name} decoding="async" />;
}
