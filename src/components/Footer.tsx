import { COPY, pageHref, type PageId } from '@/content/copy';
import { PROVENANCE_LINE } from '@/content/textures';
import { ThemeToggle } from './ThemeToggle';
import s from './Footer.module.css';
export function Footer({ current }: { current?: PageId }) {
  const h = COPY.hero;
  const chapter = current !== undefined && current !== 'hero';
  return (
    <footer className={`cut ${s.foot}`}>
      <div className={s.wrap}>
        {chapter ? (
          <div data-part="footer-cover" className={`meta ${s.cover}`}>
            <div data-part="cover-links" className={s.row}>{h.links.filter((l) => l.href !== pageHref(current)).map((l) => 'newTab' in l ? <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}<span aria-hidden="true"> ↗</span></a> : <a key={l.href} href={l.href}>{l.label}</a>)}</div>
            <span data-part="title-line">{h.titleLine}</span>
          </div>
        ) : null}
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
