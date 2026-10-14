import { render } from '@testing-library/react';
import { Specimen } from '@/Specimen';
import { TEXTURES } from '@/content/textures';

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });

it('shows every surface, every tile with provenance, both modes, and the OG and favicon faces', () => {
  const { container } = render(<Specimen />);
  expect(container.querySelectorAll('[data-mode="dark"]').length).toBe(1);
  expect(container.querySelectorAll('[data-mode="light"]').length).toBe(1);
  for (const t of TEXTURES) expect(container.textContent).toContain(t.source);
  expect(container.querySelector('#og-face')).toBeInTheDocument();
  expect(container.querySelector('#favicon-face')).toBeInTheDocument();
  expect(container.querySelectorAll('.chip').length).toBeGreaterThanOrEqual(8);
});
