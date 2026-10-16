import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { PunchNav } from '@/components/PunchNav';
import { SpineRail } from '@/components/SpineRail';
import { PAGES, SECTIONS } from '@/content/copy';
import { renderPage } from './pages';

beforeAll(() => {
  (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});

it('renders eight links to the landing and the seven pages with exactly one current and three hidden punches', () => {
  const { container } = render(<PunchNav current="vantage" />);
  const links = screen.getAllByRole('link');
  expect(links.map((a) => a.getAttribute('href'))).toEqual(['/bell', '/bell/design-system', '/bell/vantage', '/bell/nertia', '/bell/work', '/bell/terpscout', '/bell/practice', '/bell/contact']);
  expect(container.querySelectorAll('[aria-current]').length).toBe(1);
  expect(container.querySelector('[aria-current="page"]')).toHaveAttribute('href', '/bell/vantage');
  expect(container.querySelectorAll('[aria-hidden="true"] [data-part="punch"]').length).toBe(3);
  expect(screen.getByRole('navigation', { name: 'Pages' })).toBeInTheDocument();
  expect(PAGES.map((x) => x.id)).toEqual(SECTIONS.map((x) => x.id));
});
it('every page marks its own cell current, keeps the cell look, and carries the rail, the nav, the footer and the theme toggle', () => {
  expect(readFileSync('src/components/PunchNav.module.css', 'utf8')).toContain('.cell[aria-current]{background:var(--fg);color:var(--bg)}');
  for (const x of PAGES) {
    const { container, unmount } = renderPage(x.id);
    const cur = [...container.querySelectorAll('nav[aria-label="Pages"] a[aria-current="page"]')];
    expect(cur.map((a) => a.getAttribute('href')), x.id).toEqual([x.href]);
    expect(container.querySelectorAll('nav[aria-label="Pages"] a').length).toBe(8);
    for (const sel of ['[data-part="rail"]', '[data-part="band"]', '[data-part="band-end"]', 'main', 'footer']) expect(container.querySelectorAll(sel).length, `${x.id} ${sel}`).toBe(1);
    expect(container.querySelector('footer button[aria-label^="Switch to"]'), x.id).not.toBeNull();
    expect(container.querySelectorAll('#hero').length, x.id).toBe(x.id === 'hero' ? 1 : 0);
    unmount();
  }
});
it('cells show 01 to 08 with the label under each number, while each link keeps the section title as its name and title', () => {
  render(<PunchNav current="hero" />);
  const links = screen.getAllByRole('link');
  expect(links.map((a) => a.firstElementChild!.textContent)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
  expect(links.map((a) => a.querySelector('[data-part="nav-label"]')!.textContent)).toEqual(SECTIONS.map((x) => x.label));
  expect(links.map((a) => a.getAttribute('aria-label'))).toEqual(SECTIONS.map((x) => x.label));
  expect(links.map((a) => a.getAttribute('title'))).toEqual(SECTIONS.map((x) => x.label));
  for (const x of SECTIONS) expect(screen.getByRole('link', { name: x.label })).toBeInTheDocument();
});
it('rail is decorative', () => {
  const { container } = render(<SpineRail />);
  expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  expect(container.firstChild).toHaveAttribute('data-part', 'rail');
});
it('on phones the spine band sits above the nav and the footer carries none', async () => {
  const { container } = renderPage('hero');
  const band = container.querySelector('[data-part="band"]')!;
  expect(band).toHaveAttribute('aria-hidden', 'true');
  expect(band.compareDocumentPosition(container.querySelector('nav')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(container.querySelector('footer [data-part="band"]')).toBeNull();
  expect(container.querySelectorAll('[data-part="band"]').length).toBe(1);
});
it('the cover comes first, above the rail and the nav; every section after it is a cut carrying the spine band, with no page-sized fixed layer', async () => {
  const { container } = renderPage('hero');
  expect(container.querySelectorAll('[data-part="reveal"]').length).toBe(0);
  const cover = container.querySelector('#hero')!;
  expect(cover).toHaveAttribute('data-part', 'cover');
  for (const sel of ['[data-part="rail"]', '[data-part="band"]', 'nav', 'main']) expect(cover.compareDocumentPosition(container.querySelector(sel)!) & Node.DOCUMENT_POSITION_FOLLOWING, sel).toBeTruthy();
  expect(cover.classList.contains('cut')).toBe(false);
  for (const sec of container.querySelectorAll('main > section')) expect(sec.classList.contains('cut')).toBe(true);
  expect(container.querySelector('footer')!.classList.contains('cut')).toBe(true);
});

it('the first cell is named Cover and leads to the landing', () => {
  render(<PunchNav current="hero" />);
  const first = screen.getAllByRole('link')[0];
  expect(first).toHaveAttribute('aria-label', 'Cover');
  expect(first).toHaveAttribute('title', 'Cover');
  expect(first).toHaveAttribute('href', '/bell');
  expect(first).toHaveAttribute('aria-current', 'page');
});
it('the spine bookends the page: a band after the footer, at every width, above the rail', async () => {
  const { readFileSync } = await import('node:fs');
  const { container } = renderPage('hero');
  const end = container.querySelector('[data-part="band-end"]')!;
  expect(end).toHaveAttribute('aria-hidden', 'true');
  expect(container.querySelector('footer')!.nextElementSibling).toBe(end);
  expect(end.nextElementSibling).toBeNull();
  expect(readFileSync('src/components/SpineRail.module.css', 'utf8')).toContain('.end.end{display:block;position:relative;z-index:6}');
});
