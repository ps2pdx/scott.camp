import { COPY } from '@/content/copy';
import { TEXTURES } from '@/content/textures';
import { Plate } from './Evidence';
import s from './DesignStudy.module.css';

const ds = COPY.designSystem;
const shot = (file: string) => TEXTURES.find((t) => t.file === file)!;

export function SurfaceRow() {
  return (
    <ul className={s.surfaces} data-part="ds-surfaces">
      {ds.surfaces.map((x) => (
        <li key={x.key} className={s.surface}>
          <span className={s.swatch} data-swatch={x.key} />
          <span className="meta">{x.name}</span>
          <span className="meta muted">{x.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function TextureList() {
  return (
    <ul className={s.textures} data-part="ds-textures">
      {ds.textures.map((x) => {
        const t = shot(x.file);
        return (
          <li key={x.file} className={s.texture}>
            <span className={s.tile} data-tile={x.file} />
            <span className={s.caption}>
              <span className="meta">{x.name}</span>
              <span className="meta muted">{`${t.source} · ${t.camera} · ${t.shot} · ${x.cut}`}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function TypeStack() {
  return (
    <ul className={s.type} data-part="ds-type">
      {ds.type.map((x) => (
        <li key={x.role} className={s.typeRow} data-role={x.role}>
          <span className={`${x.cls} ${s.sample}`}>{x.sample}</span>
          <span className="meta muted">{`${x.role}: ${x.meta}`}</span>
        </li>
      ))}
    </ul>
  );
}

export function FigurePair() {
  return <div className={s.pair} data-part="ds-figures">{ds.figures.map((e) => <Plate key={e.src} e={e} />)}</div>;
}
