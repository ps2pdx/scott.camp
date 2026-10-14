import type { IndexRow } from '@/content/copy';
import { Surface } from './Surface';
import { Label } from './Label';
import s from './Index.module.css';
export function Index({ rows }: { rows: readonly IndexRow[] }) {
  return (
    <Surface kind="endpaper" className={s.page}>
      <Label>Index</Label>
      <div className={s.scroll} data-part="index-scroll">
        <table className={`transcript ${s.table}`} aria-label="Index of work. Struck rows belong to other sections.">
          <tbody>
            {rows.map((r) => (
              <tr key={r.no} {...(r.struck ? { 'data-struck': '' } : {})} className={r.struck ? `struck ${s.struck}` : ''}>
                {[r.no, r.name, r.description, r.year].map((c, i) => <td key={i}>{r.struck ? <del>{c}</del> : <span>{c}</span>}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}
