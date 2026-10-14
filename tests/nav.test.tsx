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
