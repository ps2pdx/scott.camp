import { EvidenceVideo, type EvidenceClip } from './EvidenceVideo';
import s from './Evidence.module.css';

export type Still = { src: string; width: number; height: number; caption: string; alt: string; mark?: boolean };

export function Plate({ e }: { e: Still }) {
  return (
    <figure className={e.mark ? `${s.plate} ${s.mark}` : s.plate}>
      <img src={e.src} width={e.width} height={e.height} alt={e.alt} loading="lazy" decoding="async" />
      <figcaption className="meta">{e.caption}</figcaption>
    </figure>
  );
}

export function Spin({ clip }: { clip: EvidenceClip & { caption: string } }) {
  return (
    <figure className={s.spin}>
      <div className={s.spinStage}><EvidenceVideo clip={clip} className={s.spinMedia} /></div>
      <figcaption className="meta">{clip.caption}</figcaption>
    </figure>
  );
}
