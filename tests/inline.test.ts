import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));

// src/lib/zero-point-v1 is a read-only vendored artefact (nertia f1a3cf56), kept as it shipped.
it('no component carries an inline style', () => {
  for (const f of walk('src').filter((p) => p.endsWith('.tsx') && !p.startsWith(join('src', 'lib', 'zero-point-v1')))) expect(readFileSync(f, 'utf8'), f).not.toMatch(/\bstyle=\{/);
});
