import type { IndexRow } from '@/content/copy';
import { Label } from './Label';
import s from './Index.module.css';
export function Index({ rows }: { rows: readonly IndexRow[] }) {
  return (
    <div className={s.page} data-part="index">
      <Label>Index</Label>
      <div className={`grain ${s.scroll}`} data-part="index-scroll">
        <table className={`meta ${s.table}`} aria-label="Index of work. Struck rows belong to other sections.">
          <colgroup><col className={s.no} /><col className={s.name} /><col className={s.desc} /><col /></colgroup>
          <tbody>
            {rows.map((r) => (
              <tr key={r.no} {...(r.struck ? { 'data-struck': '' } : {})} className={r.struck ? `struck ${s.struck}` : ''}>
                {[r.no, r.name, r.description, r.year].map((c, i) => <td key={i}>{r.struck ? <del>{c}</del> : <span>{c}</span>}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
