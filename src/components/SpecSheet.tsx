import type { Sheet } from '@/content/copy';
import { VolumeFace } from './VolumeFace';
import { Bracket } from './Bracket';
import { AboutBox, type About } from './AboutBox';
import { lede } from '@/lib/lede';
import s from './SpecSheet.module.css';

export function sheetAbout(sheet: Sheet, year?: string): About {
  const f = sheet.fields;
  return {
    description: lede(sheet.body ?? '', 2),
    place: f.Sheet?.includes('.') ? f.Sheet : sheet.label,
    type: [f.Role, f.Stack].filter(Boolean).join(', '),
    year,
    source: sheet.href && f.Sheet?.includes('.') ? 'Live site' : undefined,
  };
}

export function SpecSheet({ sheet, volume, about }: { sheet: Sheet; volume: { no: string; name: string; year: string }; about?: About }) {
  return (
    <article className={`grain tex-paper ${s.sheet}`}>
      <VolumeFace no={volume.no} name={volume.name} year={volume.year} />
      <div className={s.in}>
        <h3 className="display t-title">{`"${sheet.title}"`}{sheet.placeholder ? <> <Bracket className="meta">PLACEHOLDER</Bracket></> : null}</h3>
        <AboutBox about={about ?? sheetAbout(sheet, volume.year)} />
      </div>
      <div className={`meta ${s.ft}`}>{sheet.href ? <a href={sheet.href}>{sheet.label ?? sheet.href} ↗</a> : <span className="muted">Copy pending</span>}</div>
    </article>
  );
}
