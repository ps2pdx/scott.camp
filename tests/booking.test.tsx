import { render } from '@testing-library/react';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { App } from '@/App';
import { BOOKING_URL, COPY } from '@/content/copy';

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });

it('contact closes on the consulting sheet: eyebrow, 60 MINUTES., the terms and one cloth button to Cal in a new tab', () => {
  const { container } = render(<App />);
  const sheet = container.querySelector('#contact [data-part="booking"]')!;
  expect(sheet.textContent).toContain('"Consulting"');
  expect(sheet.querySelector('.display')!.textContent).toBe('60 minutes.');
  expect(sheet.querySelector('.text')!.textContent).toBe('One hour on your brand, design system, positioning or agent workflow.');
  const links = [...sheet.querySelectorAll('a')];
  expect(links).toHaveLength(1);
  expect(links[0].getAttribute('href')).toBe('https://cal.com/scott-campbell/consulting');
  expect(links[0].getAttribute('target')).toBe('_blank');
  expect(links[0].getAttribute('rel')).toBe('noopener');
  expect(links[0].getAttribute('data-variant')).toBe('primary');
  expect(links[0].textContent).toBe('Book a session ↗');
  expect(BOOKING_URL).toBe(COPY.contact.consulting.href);
});

it('the cover carries Book after Resume, to the same Cal URL', () => {
  const { container } = render(<App />);
  const links = [...container.querySelectorAll('#hero [data-part="cover-links"] a')];
  expect(links.at(-2)!.firstChild!.textContent).toBe('Resume');
  expect(links.at(-1)!.firstChild!.textContent).toBe('Book');
  expect(links.at(-1)!.getAttribute('href')).toBe(BOOKING_URL);
  expect(links.at(-1)!.getAttribute('target')).toBe('_blank');
});

it('the Cal embed is gone: no iframe, no component, no dependency, nothing loads from Cal until the click', () => {
  const { container } = render(<App />);
  expect(container.querySelector('iframe, [data-part="cal-booking"]')).toBeNull();
  expect(existsSync('src/components/CalBooking.tsx')).toBe(false);
  expect(existsSync('src/components/CalInline.tsx')).toBe(false);
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(JSON.stringify(pkg)).not.toContain('@calcom');
  for (const f of readdirSync('src/components')) expect(readFileSync(`src/components/${f}`, 'utf8'), f).not.toContain('@calcom');
});
