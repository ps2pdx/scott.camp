import { Punches } from './Punches';
import { useActiveSection } from '@/lib/activeSection';
import s from './PunchNav.module.css';
export function PunchNav({ sections }: { sections: readonly { id: string; label: string }[] }) {
  const active = useActiveSection(sections.map((x) => x.id));
  return (
    <nav className={`grain tex-paper ${s.nav}`} aria-label="Sections">
      <Punches className={s.punches} />
      <ul className={s.cells}>
        {sections.map((x, i) => (
          <li key={x.id}><a href={`#${x.id}`} aria-label={x.label} title={x.label} className={`meta-sm ${s.cell}`} {...(active === x.id ? { 'aria-current': 'location' as const } : {})}>{String(i + 1).padStart(2, '0')}</a></li>
        ))}
      </ul>
    </nav>
  );
}
