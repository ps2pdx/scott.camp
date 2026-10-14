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
it('cells show 01 to 07 while each link keeps the section title as its name and title', () => {
  render(<PunchNav sections={SECTIONS} />);
  const links = screen.getAllByRole('link');
  expect(links.map((a) => a.textContent)).toEqual(['01', '02', '03', '04', '05', '06', '07']);
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
it('one fixed spine layer sits behind the page and every divider after the hero is a cut', async () => {
  const { App } = await import('@/App');
  const { container } = render(<App />);
  expect(container.querySelectorAll('[data-part="reveal"]').length).toBe(1);
  expect(container.querySelector('[data-part="reveal"]')).toHaveAttribute('aria-hidden', 'true');
  const sections = [...container.querySelectorAll('main > section')];
  expect(sections[0].classList.contains('cut')).toBe(false);
  for (const s of sections.slice(1)) expect(s.classList.contains('cut')).toBe(true);
  expect(container.querySelector('footer')!.classList.contains('cut')).toBe(true);
});
