import { render, screen } from '@testing-library/react';
import { PunchNav } from '@/components/PunchNav';
import { SpineRail } from '@/components/SpineRail';
import { SECTIONS } from '@/content/copy';

beforeAll(() => {
  (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});

it('renders seven links to the seven sections with exactly one current and three hidden punches', () => {
  const { container } = render(<PunchNav sections={SECTIONS} />);
  const links = screen.getAllByRole('link');
  expect(links.map((a) => a.getAttribute('href'))).toEqual(SECTIONS.map((s) => `#${s.id}`));
  expect(container.querySelectorAll('[aria-current]').length).toBe(1);
  expect(container.querySelectorAll('[aria-hidden="true"] [data-part="punch"]').length).toBe(3);
  expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
});
it('cells show 01 to 08 while each link keeps the section title as its name and title', () => {
  render(<PunchNav sections={SECTIONS} />);
  const links = screen.getAllByRole('link');
  expect(links.map((a) => a.textContent)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
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
  const { App } = await import('@/App');
  const { container } = render(<App />);
  const band = container.querySelector('[data-part="band"]')!;
  expect(band).toHaveAttribute('aria-hidden', 'true');
  expect(band.compareDocumentPosition(container.querySelector('nav')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(container.querySelector('footer [data-part="band"]')).toBeNull();
  expect(container.querySelectorAll('[data-part="band"]').length).toBe(1);
});
it('the cover comes first, above the rail and the nav; every section after it is a cut over one fixed spine layer', async () => {
  const { App } = await import('@/App');
  const { container } = render(<App />);
  expect(container.querySelectorAll('[data-part="reveal"]').length).toBe(1);
  const cover = container.querySelector('#hero')!;
  expect(cover).toHaveAttribute('data-part', 'cover');
  for (const sel of ['[data-part="rail"]', '[data-part="band"]', 'nav', 'main']) expect(cover.compareDocumentPosition(container.querySelector(sel)!) & Node.DOCUMENT_POSITION_FOLLOWING, sel).toBeTruthy();
  expect(cover.classList.contains('cut')).toBe(false);
  for (const sec of container.querySelectorAll('main > section')) expect(sec.classList.contains('cut')).toBe(true);
  expect(container.querySelector('footer')!.classList.contains('cut')).toBe(true);
});

it('the first cell is named Cover', () => {
  render(<PunchNav sections={SECTIONS} />);
  const first = screen.getAllByRole('link')[0];
  expect(first).toHaveAttribute('aria-label', 'Cover');
  expect(first).toHaveAttribute('title', 'Cover');
  expect(first).toHaveAttribute('href', '#hero');
});
it('the spine bookends the page: a band after the footer, at every width, above the rail', async () => {
  const { App } = await import('@/App');
  const { readFileSync } = await import('node:fs');
  const { container } = render(<App />);
  const end = container.querySelector('[data-part="band-end"]')!;
  expect(end).toHaveAttribute('aria-hidden', 'true');
  expect(container.querySelector('footer')!.nextElementSibling).toBe(end);
  expect(end.nextElementSibling).toBeNull();
  expect(readFileSync('src/components/SpineRail.module.css', 'utf8')).toContain('.end.end{display:block;position:relative;z-index:6}');
});
