import type { IndexRow } from '@/content/copy';
import { Surface } from './Surface';
import { Label } from './Label';
import s from './Index.module.css';
export function Index({ rows }: { rows: readonly IndexRow[] }) {
  return (
    <Surface kind="endpaper" className={s.page}>
      <Label>Index</Label>
      <table className={`transcript ${s.table}`}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.no} {...(r.struck ? { 'data-struck': '' } : {})} className={r.struck ? `struck ${s.struck}` : ''}>
              {[r.no, r.name, r.description, r.year].map((c, i) => <td key={i}><span>{c}</span></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </Surface>
  );
}
