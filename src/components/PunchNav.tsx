import { Punches } from './Punches';
import { useActiveSection } from '@/lib/activeSection';
import s from './PunchNav.module.css';
export function PunchNav({ sections }: { sections: readonly { id: string; label: string }[] }) {
  const active = useActiveSection(sections.map((x) => x.id));
  return (
    <nav className={`grain tex-paper ${s.nav}`} aria-label="Sections">
      <Punches className={s.punches} />
      <ul className={s.cells}>
        {sections.map((x) => (
          <li key={x.id}><a href={`#${x.id}`} className={`meta-sm ${s.cell}`} {...(active === x.id ? { 'aria-current': 'location' as const } : {})}>{x.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
