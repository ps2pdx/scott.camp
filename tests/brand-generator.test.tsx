import { render, fireEvent, act } from '@testing-library/react';
import { generateDemoBrandSystem } from '@/lib/brand-generator/demo-brand-system';
import { generateFullCss } from '@/lib/brand-generator/tokens-to-css';
import { deriveDesignDecisions, generateDecisionSummary } from '@/lib/brand-generator/decision-rules';
import { BrandGenerator, DEFAULT_INPUTS, BRAND_GENERATOR_CAPTION } from '@/components/BrandGenerator';

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-01-20T00:00:00.000Z')); });
afterEach(() => { vi.useRealTimers(); });
const openAll = (c: HTMLElement) => act(() => { for (const d of c.querySelectorAll('details')) { d.open = true; fireEvent(d, new Event('toggle')); } });

it('the default answers produce the same brand system, CSS and decision summary every time', () => {
  expect(DEFAULT_INPUTS.companyName).toBe('Halo Smash Burgers');
  const system = generateDemoBrandSystem(DEFAULT_INPUTS);
  expect(system).toMatchSnapshot('brand system');
  expect(generateFullCss(system)).toMatchSnapshot('css');
  expect(generateDecisionSummary(deriveDesignDecisions(DEFAULT_INPUTS))).toMatchSnapshot('summary');
});
it('the form renders the nine answers, light and dark samples, the voice line and the readout', () => {
  const { container, getByText } = render(<BrandGenerator />);
  const form = container.querySelector('form')!;
  expect(form.querySelectorAll('select').length).toBe(6);
  expect(form.querySelectorAll('input').length).toBe(2);
  expect(form.querySelectorAll('[aria-pressed="true"]').length).toBe(3);
  expect([...container.querySelectorAll('[data-part="brand-sample"]')].map((x) => x.getAttribute('data-scheme'))).toEqual(['light', 'dark']);
  for (const sample of container.querySelectorAll('[data-part="brand-sample"]')) expect(sample.querySelectorAll('a').length).toBe(2);
  expect(container.querySelector('[data-part="brand-voice"]')!.textContent).toContain('Halo Smash Burgers: Where playful meets results');
  const plate = container.querySelector('[data-part="brand-plate"]')!;
  expect(plate.parentElement!.tagName).toBe('FIGURE');
  expect(plate.nextElementSibling!.tagName).toBe('FIGCAPTION');
  for (const sel of ['form', 'details', '[data-part="brand-sample"]', '[data-part="brand-voice"]']) expect(plate.querySelector(sel), sel).not.toBeNull();
  const details = [...container.querySelectorAll('details')];
  expect(details.map((d) => d.querySelector('summary span')!.textContent)).toEqual(['Decision log', 'Token readout']);
  expect(details.every((d) => !d.open)).toBe(true);
  expect(container.querySelector('[data-part="brand-summary"]')).toBeNull();
  expect(container.querySelector('[data-part="brand-readout"]')).toBeNull();
  openAll(container);
  expect(container.querySelector('[data-part="brand-summary"]')!.textContent).toContain('## Industry Intelligence: Consumer Apps');
  expect(container.querySelectorAll('[data-part="brand-readout"] dt').length).toBe(5);
  expect(container.querySelector('figcaption')!.textContent).toBe(BRAND_GENERATOR_CAPTION);
  getByText('Random');
});
it('Random changes the output', () => {
  const { container, getByText } = render(<BrandGenerator />);
  openAll(container);
  const readoutBefore = container.querySelector('[data-part="brand-readout"]')!.textContent;
  const before = container.querySelector('[data-part="brand-summary"]')!.textContent + container.querySelector('[data-part="brand-voice"]')!.textContent!;
  const seq = [0.11, 0.42, 0.73, 0.05, 0.9, 0.33, 0.66, 0.21, 0.58, 0.84, 0.15, 0.47, 0.29, 0.95, 0.62, 0.38];
  let i = 0;
  const rnd = vi.spyOn(Math, 'random').mockImplementation(() => seq[i++ % seq.length]!);
  fireEvent.click(getByText('Random'));
  rnd.mockRestore();
  const after = container.querySelector('[data-part="brand-summary"]')!.textContent + container.querySelector('[data-part="brand-voice"]')!.textContent!;
  expect(after).not.toBe(before);
  expect(container.querySelector('[data-part="brand-readout"]')!.textContent).not.toBe(readoutBefore);
  expect((container.querySelector('form input') as HTMLInputElement).value).not.toBe('Halo Smash Burgers');
});
