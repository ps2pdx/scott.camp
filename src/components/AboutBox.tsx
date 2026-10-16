import s from './AboutBox.module.css';

export type About = { description: string; place?: string; type?: string; year?: string; source?: string };
const KEYS = [['Place', 'place'], ['Type', 'type'], ['Year', 'year'], ['Source', 'source']] as const;

export function AboutBox({ about, className }: { about: About; className?: string }) {
  const rows = KEYS.filter(([, k]) => about[k]);
  return (
    <div className={`${s.box} ${className ?? ''}`} data-part="about">
      <div className={s.about}><span className="meta">About</span><p className={`text ${s.desc}`}>{about.description}</p></div>
      {rows.length ? <dl className={s.facts}>{rows.map(([label, k]) => <div key={k} className={s.row}><dt className="meta">{label}</dt><dd className="meta">{about[k]}</dd></div>)}</dl> : null}
    </div>
  );
}
