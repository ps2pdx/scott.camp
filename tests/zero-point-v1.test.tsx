import { render, fireEvent } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import ZeroPointV1 from '@/lib/zero-point-v1/ZeroPointV1';

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });

it('runs inside its frame: the taxonomy sidebar, no page-level landmarks, the drawer opens with CSS and JSON export', () => {
  const { container } = render(<ZeroPointV1 />);
  const zp = container.querySelector('[data-part="zero-point-v1"]') as HTMLElement;
  const links = [...zp.querySelectorAll('.ds-sidebar__link')].map((a) => a.textContent);
  for (const want of ['00 / COLOR', '01 / TYPE', '02 / SCALE', '03 / RADIUS', '04 / STROKE', '07 / BUTTONS', '08 / INPUTS', '10 / CARDS', '15 / LOGO']) expect(links.some((l) => l!.startsWith(want)), want).toBe(true);
  for (const a of zp.querySelectorAll('.ds-sidebar__link')) expect(zp.querySelector(a.getAttribute('href')!)).not.toBeNull();
  expect(zp.querySelector('h1, main, section')).toBeNull();
  expect(zp.querySelector('#tokenShare')).toBeNull();
  const drawer = zp.querySelector('#tokenDrawer') as HTMLElement;
  fireEvent.click(zp.querySelector('#tokenTab')!);
  expect(drawer.dataset.open).toBe('true');
  expect([...drawer.querySelectorAll('[data-export]')].map((b) => b.getAttribute('data-export')).sort()).toEqual(['css', 'json']);
  expect(drawer.querySelectorAll('.tk-row').length).toBeGreaterThan(40);
  fireEvent.click(zp.querySelector('#editToggle')!);
  expect(zp.dataset.editMode).toBe('true');
  expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  expect(document.documentElement.getAttribute('style')).toBeFalsy();
});
it('its stylesheet is scoped under .zp and never touches the page tokens or loads a web font', () => {
  const css = readFileSync('src/lib/zero-point-v1/zero-point-v1.css', 'utf8');
  expect(css).not.toMatch(/:root|(^|[\s,}])(html|body)[\s,{[]|@import|fonts\.googleapis/);
  const sels = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(^|})\s*([^{}@]+)\{/g)].map((m) => m[2].trim()).filter((x) => !/^(from|to|\d+%)/.test(x));
  for (const s of sels) for (const part of s.split(',')) expect(part.trim(), part).toMatch(/^\.zp/);
  const tsx = readFileSync('src/lib/zero-point-v1/ZeroPointV1.tsx', 'utf8');
  expect(tsx).not.toMatch(/document\.documentElement|document\.body|history\.|fonts\.googleapis|location\.hash/);
});
