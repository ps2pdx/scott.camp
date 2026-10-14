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
it('index has fourteen rows numbered 01 to 14 with five unstruck', () => {
  expect(COPY.work.index.map((r) => r.no)).toEqual(Array.from({ length: 14 }, (_, i) => String(i + 1).padStart(2, '0')));
  expect(COPY.work.index.filter((r) => !r.struck).map((r) => r.name)).toEqual(['pharmtobody.com', 'purezerophotography.com', 'bend.cleaning', 'fullscopesupply.com', 'typeshit.shop']);
});
it('the hero headline is locked', () => { expect(COPY.hero.headline).toBe('I design systems agents ship.'); expect(VANTAGE_CASE_STUDY_URL).toMatch(/^https:/); });
it('hero facts carry real labels, not placeholder brackets', () => {
  expect(COPY.hero.facts.map((f) => f.when)).toEqual(['Vantage', 'Vantage', 'Work', 'TerpScout']);
  expect(COPY.hero.facts[3].text).toBe('$10M sold, 2019 to 2021, regulated CPG');
});
