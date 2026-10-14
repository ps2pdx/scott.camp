import s from './DataTable.module.css';

export function DataTable({ label, rows }: { label: string; rows: readonly (readonly string[])[] }) {
  return (
    <table className={`transcript ${s.table}`} aria-label={label}>
      <tbody>{rows.map((r) => <tr key={r.join('|')}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
    </table>
  );
}
