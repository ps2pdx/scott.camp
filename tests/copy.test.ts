import { COPY, VANTAGE_CASE_STUDY_URL } from '@/content/copy';
import { readFileSync } from 'node:fs';

const file = readFileSync('src/content/copy.ts', 'utf8');

it('has no em dash and no en dash used as one', () => {
  expect(file).not.toContain('\u2014');
  expect(file).not.toMatch(/\s\u2013\s/);
});
it('never says Series A', () => { expect(JSON.stringify(COPY.vantage)).not.toContain('Series A'); });
it('no sheet header field is empty', () => {
  for (const s of [...COPY.work.sheets, ...COPY.practice.sheets, ...COPY.nertia.sheets]) for (const [k, v] of Object.entries(s.fields)) expect(v, `${s.title} ${k}`).not.toBe('');
});
it('index has thirteen rows numbered 01 to 13 with four unstruck', () => {
  expect(COPY.work.index.map((r) => r.no)).toEqual(Array.from({ length: 13 }, (_, i) => String(i + 1).padStart(2, '0')));
  expect(COPY.work.index.filter((r) => !r.struck).map((r) => r.name)).toEqual(['pharmtobody.com', 'purezerophotography.com', 'bend.cleaning', 'fullscopesupply.com']);
});
it('the hero headline is locked', () => { expect(COPY.hero.headline).toBe('I design systems agents ship.'); expect(VANTAGE_CASE_STUDY_URL).toMatch(/^https:/); });
it('hero facts carry real labels, not placeholder brackets', () => {
  expect(COPY.hero.facts.map((f) => f.when)).toEqual(['Vantage', 'Vantage', 'Work', 'TerpScout']);
  expect(COPY.hero.facts[3].text).toBe('$10M sold, 2019 to 2021, regulated CPG');
});
