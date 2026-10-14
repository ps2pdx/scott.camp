import { render } from '@testing-library/react';
import { Specimen, PARTS, LIVING_LINE } from '@/Specimen';
import { TEXTURES } from '@/content/textures';

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });

it('shows the surfaces in both modes, every tile with provenance, and the OG and favicon faces', () => {
  const { container } = render(<Specimen />);
  expect(container.querySelectorAll('[data-mode="dark"]').length).toBe(1);
  expect(container.querySelectorAll('[data-mode="light"]').length).toBe(1);
  for (const t of TEXTURES.filter((x) => x.file !== 'chip')) expect(container.textContent).toContain(t.source);
  expect(container.querySelector('#og-face')).toBeInTheDocument();
  expect(container.querySelector('#favicon-face')).toBeInTheDocument();
  expect(container.querySelectorAll('[data-variant="primary"]').length).toBe(4);
});
it('is living documentation laid out as one catalogue: groups in order, one part per row, name and tokens under each', () => {
  const { container } = render(<Specimen />);
  expect(container.querySelector('main > p')!.textContent).toBe(LIVING_LINE);
  expect(LIVING_LINE).toBe('Living documentation. Every part the site uses is shown here first.');
  expect([...container.querySelectorAll('main > section')].map((x) => x.getAttribute('aria-label'))).toEqual(['Surfaces', 'Type', 'Spacing', 'Marks', 'Controls', 'Textures', 'Figures', 'Tables']);
  for (const sec of container.querySelectorAll('main > section')) expect(sec.classList.contains('cut')).toBe(true);
  const rows = [...container.querySelectorAll('[data-part-name]')];
  expect(rows.length).toBe(PARTS.length);
  for (const r of rows) { expect(r.children.length).toBe(2); expect(r.lastElementChild!.querySelectorAll('.meta').length).toBe(2); }
  const names = PARTS.map((p) => p.name);
  for (const want of [/Disclosure summary row/, /Evidence figure/, /Video figure with poster/, /Spine band/, /Divider cut/, /Cloth button/, /Punch nav, numbered/, /TerpScout mark/, /Nertia mark/, /Type ink/, /Spacing scale/]) expect(names.some((n) => want.test(n)), String(want)).toBe(true);
  expect(PARTS.filter((p) => p.group === 'Type').slice(0, 5).map((p) => p.name)).toEqual(['Display', 'Title', 'Text', 'Meta', 'Transcript']);
  expect(container.querySelector('[data-surface="eggshell"]')!.textContent).toContain('#f3f1ea');
  expect(container.querySelectorAll('[data-part="band"]').length).toBe(1);
  expect(container.querySelectorAll('[data-part="cut-demo"] .cut').length).toBe(1);
});
