import { COPY, pageHref, type PageId } from '@/content/copy';
import { PROVENANCE_LINE } from '@/content/textures';
import { ThemeToggle } from './ThemeToggle';
import s from './Footer.module.css';
export function Footer({ current }: { current?: PageId }) {
  const h = COPY.hero;
  const chapter = current !== undefined && current !== 'hero';
  return (
    <footer className={`cut ${s.foot}`} data-surface="inverse">
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
        <div data-part="built-on" className={s.built}>
          <a href={COPY.footer.mark.href} aria-label={COPY.footer.mark.label} className={s.mark}><NertiaMark /></a>
          <p className="text">{COPY.footer.tagline}</p>
        </div>
        <p className="meta" data-part="copyright">{COPY.footer.copyright}</p>
        <p className="meta muted">{PROVENANCE_LINE}</p>
      </div>
    </footer>
  );
}

function NertiaMark() {
  return (
    <svg viewBox="0 0 240 199" fill="none" aria-hidden="true" focusable="false">
      <path d="M237.212 59.1696C209.836 254.57 190.513 213.836 112.53 124.818C58.9189 70.1257 -15.2326 276.364 2.74688 136.908C33.5806 -102.25 78.1597 35.2236 132.501 80.256C168.893 106.854 256.702 -79.9384 237.212 59.1696Z" fill="currentColor" />
    </svg>
  );
}
