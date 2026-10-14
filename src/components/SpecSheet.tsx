import type { Sheet } from '@/content/copy';
import { VolumeFace } from './VolumeFace';
import { Bracket } from './Bracket';
import s from './SpecSheet.module.css';
export function SpecSheet({ sheet, volume }: { sheet: Sheet; volume: { no: string; name: string; year: string } }) {
  const fields = Object.entries(sheet.fields).filter(([, v]) => v);
  return (
    <article className={`grain tex-paper ${s.sheet}`}>
      <VolumeFace no={volume.no} name={volume.name} year={volume.year} />
      <div className={s.hdr}>{fields.map(([k, v]) => <div key={k} className="meta"><span className={`muted ${s.k}`}>{k}</span>{v}</div>)}</div>
      <div className={s.in}>
        <h3 className="display t-title">{`"${sheet.title}"`}{sheet.placeholder ? <> <Bracket className="meta">PLACEHOLDER</Bracket></> : null}</h3>
        {sheet.body ? <p className="text">{sheet.body}</p> : null}
      </div>
      <div className={`meta ${s.ft}`}>{sheet.href ? <a href={sheet.href}>{sheet.label ?? sheet.href} ↗</a> : <span className="muted">Copy pending</span>}</div>
    </article>
  );
}
