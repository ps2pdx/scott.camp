import { render } from '@testing-library/react';
import { Specimen, PARTS, LIVING_LINE } from '@/Specimen';
import { TEXTURES } from '@/content/textures';

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });

it('shows every surface, every tile with provenance, both modes, and the OG and favicon faces', () => {
  const { container } = render(<Specimen />);
  expect(container.querySelectorAll('[data-mode="dark"]').length).toBe(1);
  expect(container.querySelectorAll('[data-mode="light"]').length).toBe(1);
  for (const t of TEXTURES) expect(container.textContent).toContain(t.source);
  expect(container.querySelector('#og-face')).toBeInTheDocument();
  expect(container.querySelector('#favicon-face')).toBeInTheDocument();
  expect(container.querySelectorAll('[data-variant="primary"]').length).toBeGreaterThanOrEqual(8);
});
it('is living documentation: the line at the top and every part the site uses', () => {
  const { container } = render(<Specimen />);
  expect(container.firstElementChild!.textContent).toBe('Living documentation. Every part the site uses is shown here first.');
  expect(LIVING_LINE).toBe(container.firstElementChild!.textContent);
  const heads = [...container.querySelectorAll('[data-mode="light"] h2')].map((h) => h.textContent);
  expect(heads.length).toBe(PARTS.length);
  for (const want of [/Disclosure summary row/, /Evidence figure, stacked/, /video figure with poster/, /Spine band/, /Divider cut/, /Cloth button/, /Punch nav, numbered/]) expect(heads.some((h) => want.test(h!)), String(want)).toBe(true);
  expect(container.querySelector('[data-surface="eggshell"]')!.textContent).toContain('#f3f1ea');
  expect(container.querySelectorAll('[data-mode] details summary').length).toBe(2);
  expect(container.querySelectorAll('[data-part="band"]').length).toBe(2);
  expect(container.querySelectorAll('[data-part="cut-demo"] .cut').length).toBe(2);
  expect(container.querySelectorAll('[data-mode] figure figcaption').length).toBeGreaterThanOrEqual(4);
});
