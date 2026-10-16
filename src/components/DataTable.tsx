import s from './DataTable.module.css';

export function DataTable({ label, rows, kind }: { label: string; rows: readonly (readonly string[])[]; kind: 'tiers' | 'tools' }) {
  return (
    <div className={`grain ${s.wrap}`}>
      <table className={`transcript ${s.table} ${s[kind]}`} aria-label={label}>
        <colgroup>{rows[0].map((_, i) => <col key={i} />)}</colgroup>
        <tbody>{rows.map((r) => <tr key={r.join('|')}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
