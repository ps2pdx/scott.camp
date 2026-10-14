import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));

it('no component carries an inline style', () => {
  for (const f of walk('src').filter((p) => p.endsWith('.tsx'))) expect(readFileSync(f, 'utf8'), f).not.toMatch(/\bstyle=\{/);
});
