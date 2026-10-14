import { render } from '@testing-library/react';
import { generateContract, asOklch, CONTRACT_VARS, DEFAULT_SEED } from '@/lib/generator/generate';
import { Generator } from '@/components/Generator';

it('the default colour expands to the same contract every time (snapshot of the vendored functions)', () => {
  expect(DEFAULT_SEED).toBe('#2bf52b');
  for (const scheme of ['light', 'dark'] as const) {
    const out = generateContract(DEFAULT_SEED, scheme);
    expect(Object.fromEntries(CONTRACT_VARS.map((k) => [k, out[k]]))).toMatchSnapshot(scheme);
    for (const k of CONTRACT_VARS) expect(out[k], k).toBeTruthy();
  }
});
it('the brand lands verbatim on --accent and hex values read out as oklch', () => {
  expect(generateContract('#2bf52b', 'light')['--accent']).toBe('#2bf52b');
  expect(asOklch('#ffffff')).toBe('oklch(1 0 0)');
  expect(asOklch('oklch(0.92 0.004 286.32)')).toBe('oklch(0.92 0.004 286.32)');
});
it('the figure renders the sample with both buttons and a readout of every contract variable', () => {
  const { container } = render(<Generator />);
  const sample = container.querySelector('[data-part="generator-sample"]')!;
  expect([...sample.querySelectorAll('a')].map((a) => a.textContent)).toEqual(['Primary', 'Outline']);
  expect(sample.querySelector('h3')).not.toBeNull();
  expect(sample.querySelector('table tr')).not.toBeNull();
  const dts = [...container.querySelectorAll('[data-part="generator-readout"] dt')].map((d) => d.textContent);
  expect(dts).toEqual([...CONTRACT_VARS]);
  expect(container.querySelector('input[type="color"]')).toHaveValue('#2bf52b');
  expect((sample as HTMLElement).style.getPropertyValue('--accent')).toBe('#2bf52b');
});
