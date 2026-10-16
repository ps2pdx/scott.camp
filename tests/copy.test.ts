import { COPY, VANTAGE_CASE_STUDY_URL } from '@/content/copy';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const scanned = [
  ...walk('src'), ...walk('tests'),
  ...readdirSync('.').filter((f) => f.endsWith('.html')),
  ...['bell', 'specimen'].map((d) => `${d}/index.html`),
  ...readdirSync('public').filter((f) => f.endsWith('.html')).map((f) => `public/${f}`),
];

it('has no em dash and no en dash in source, tests or pages', () => {
  expect(scanned.length).toBeGreaterThan(20);
  for (const f of scanned) {
    const text = readFileSync(f, 'utf8');
    expect(text.includes('\u2014'), `${f} em dash`).toBe(false);
    expect(text.includes('\u2013'), `${f} en dash`).toBe(false);
  }
});
it('never says Series A', () => { expect(JSON.stringify(COPY.vantage)).not.toContain('Series A'); });
it('no sheet header field is empty', () => {
  for (const s of [...COPY.work.sheets, ...COPY.practice.sheets, ...COPY.nertia.sheets]) for (const [k, v] of Object.entries(s.fields)) expect(v, `${s.title} ${k}`).not.toBe('');
});
it('index has thirteen rows numbered 01 to 13, none struck on the front matter, KAL Contracting gone', () => {
  expect(COPY.work.index.map((r) => r.no)).toEqual(Array.from({ length: 13 }, (_, i) => String(i + 1).padStart(2, '0')));
  expect(COPY.work.index.filter((r) => r.struck)).toEqual([]);
});
it('the hero headline is locked', () => { expect(COPY.hero.headline).toBe("Something Click'd"); expect(COPY.hero.eyebrow).toBe('I design systems agents ship.'); expect(VANTAGE_CASE_STUDY_URL).toMatch(/^https:/); });
it('hero facts carry real labels, not placeholder brackets', () => {
  expect(COPY.hero.facts.map((f) => f.when)).toEqual(['Nertia', 'Vantage', 'TerpScout', 'Work']);
  expect(COPY.hero.facts[0].text).toBe('Shipped as a web app and an MCP server');
  expect(COPY.hero.facts[2].text).toBe('$10M sold, 2020 to 2022, regulated CPG');
});
it('the TerpScout running head spans 2016 to 2022', () => { expect(COPY.terpscout.runningHead).toBe('TerpScout [2016 to 2022]'); });
it('the TerpScout Network row is dated 2017 to 2020 from the resume', () => { expect(COPY.terpscout.rows.find((r) => r.who === 'Network')!.when).toBe('2017 to 2020'); });
it('Nertia started December 2025: origin row 12/2025, index year 2025', () => {
  expect(COPY.nertia.rows.find((r) => r.who === 'Origin')!.when).toBe('12/2025');
  expect(COPY.work.index.find((r) => r.name === 'Nertia')!.year).toBe('2025');
});
it('ScoutCamp is $10M total, 2020 to 2022, with no per-year rate anywhere', () => {
  const all = JSON.stringify(COPY);
  expect(all).not.toContain('$5M');
  expect(all).not.toContain('2019 to 2021');
  expect(COPY.terpscout.rows.find((r) => r.who === 'Volume')).toEqual({ when: '2020 to 2022', who: 'Volume', text: '$10M across three wholesale locations and about 30 vendors.' });
  expect(COPY.terpscout.runningHead).toBe('TerpScout [2016 to 2022]');
});
it('the Nertia origin row counts ten months from December 2025', () => { expect(COPY.nertia.rows.find((r) => r.who === 'Origin')!.text).toContain('Ten months on,'); });
it('KAL Contracting is not in the index and Pharm to Body is Vol. 07', () => {
  expect(COPY.work.index.some((r) => r.name === 'KAL Contracting')).toBe(false);
  expect(COPY.work.index.find((r) => r.name === 'Pharm to Body')!.no).toBe('07');
});
it('the yellow pages open by continuing the cover, verbatim', () => {
  expect(COPY.hero.lead).toBe('Around last year, when I was building my portfolio, it pivoted into a design system generator, which is now Nertia: an agentic wormhole out of the corporate web.');
});
it('the Vantage and Work facts read as Scott set them on 2026-10-15', () => {
  expect(COPY.hero.facts.find((f) => f.when === 'Vantage')!.text).toBe('2 trademarked phrases authored, brand system shipped for enablement, pitch and report');
  expect(COPY.hero.facts.find((f) => f.when === 'Work')!.text).toBe('5 live client sites, 4 on the Nertia platform');
});
