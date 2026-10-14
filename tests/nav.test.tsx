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
  expect(container.querySelectorAll('.hole').length).toBe(3);
  expect(container.querySelector('[aria-hidden="true"] .hole')).toBeInTheDocument();
  expect(container.querySelector('nav')).toHaveAttribute('aria-label', 'Sections');
});
it('rail is decorative', () => {
  const { container } = render(<SpineRail />);
  expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  expect(container.firstChild).toHaveClass('rail');
});
