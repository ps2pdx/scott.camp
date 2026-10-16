import type { IndexRow } from '@/content/copy';
import { Label } from './Label';
import s from './Index.module.css';
export function Index({ rows, label = 'Index of work. Struck rows belong to other sections.' }: { rows: readonly IndexRow[]; label?: string }) {
  return (
    <div className={s.page} data-part="index">
      <Label>Index</Label>
      <div className={s.scroll} data-part="index-scroll">
        <table className={`meta ${s.table}`} aria-label={label}>
          <colgroup><col className={s.no} /><col className={s.name} /><col className={s.desc} /><col /></colgroup>
          <tbody>
            {rows.map((r) => (
              <tr key={r.no} {...(r.struck ? { 'data-struck': '' } : {})} {...(r.current ? { 'data-current': '' } : {})} className={`${r.struck ? `struck ${s.struck}` : ''} ${r.current ? s.current : ''}`}>
                {[r.no, r.name, r.description, r.year].map((c, i) => { const t = i === 1 && r.href ? <a href={r.href} {...(r.current ? { 'aria-current': 'page' as const } : {})}>{c}</a> : c; return <td key={i}>{r.struck ? <del>{t}</del> : <span>{t}</span>}</td>; })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
