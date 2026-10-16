import { PAGES, type PageId } from '@/content/copy';
import { Punches } from './Punches';
import s from './PunchNav.module.css';
export function PunchNav({ current }: { current: PageId }) {
  return (
    <nav className={`grain tex-paper ${s.nav}`} aria-label="Pages">
      <Punches className={s.punches} />
      <ul className={s.cells}>
        {PAGES.map((x, i) => (
          <li key={x.id}><a href={x.href} aria-label={x.label} title={x.label} className={`meta bleed-nav ${s.cell}`} {...(current === x.id ? { 'aria-current': 'page' as const } : {})}>{String(i + 1).padStart(2, '0')}</a></li>
        ))}
      </ul>
    </nav>
  );
}
