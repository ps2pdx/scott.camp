import { COPY } from '@/content/copy';
import { PROVENANCE_LINE } from '@/content/textures';
import { ThemeToggle } from './ThemeToggle';
import s from './Footer.module.css';
export function Footer() {
  return (
    <footer className={`cut ${s.foot}`}>
      <div className={s.wrap}>
        <ul className={`meta ${s.links}`}>
          {COPY.footer.links.map((l) => <li key={l.href}><a href={l.href}>{l.label} ↗</a></li>)}
          <li><ThemeToggle /></li>
        </ul>
        <p className="text">{COPY.footer.tagline}</p>
        <p className="meta muted">{PROVENANCE_LINE}</p>
      </div>
    </footer>
  );
}
