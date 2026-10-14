import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { App } from '@/App';
import { COPY, SECTIONS } from '@/content/copy';

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });

it('renders the seven sections in order with running heads', () => {
  const { container } = render(<App />);
  expect([...container.querySelectorAll('section')].map((s) => s.id)).toEqual(['hero', 'endpapers', ...SECTIONS.slice(1).map((s) => s.id)]);
  expect(screen.getByText('Portland, Oregon')).toBeInTheDocument();
  expect(screen.getByText('"I design systems agents ship."')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Something Click'd");
});
it('carries the code-site line, the provenance line and the resume', () => {
  render(<App />);
  expect(screen.getByText(/This page is a code site published by an agent/)).toBeInTheDocument();
  expect(screen.getByText('Textures photographed from one copy of ICONS, 10.13.26.')).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /Resume|Download resume/ })[0]).toHaveAttribute('href', '/Scott_Campbell_Resume.pdf');
});
it('places nine tech sheets and fourteen index rows', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('figure svg[role="img"]').length).toBe(9);
  expect(container.querySelectorAll('tr').length).toBe(14);
});

describe('theme boot', () => {
  const boot = readFileSync('bell/index.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)![1];
  const run = () => new Function(boot)();
  afterEach(() => { document.documentElement.removeAttribute('data-theme'); localStorage.clear(); });
  it('a stored override wins before paint', () => {
    localStorage.setItem('theme', 'light');
    run();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
  it('with nothing stored the attribute stays off so prefers-color-scheme decides', () => {
    run();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
  it('ignores a junk value', () => {
    localStorage.setItem('theme', 'sepia');
    run();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
});
it('Practice carries the Marquee Mondays evidence pair with captions and alt text', () => {
  render(<App />);
  for (const c of ['Event banner, Marquee Mondays 017, District, 5 June 2017', 'Series banner, Marquee Mondays, District, 2017']) expect(screen.getByText(c).closest('figure')!.querySelector('img')!.getAttribute('alt')).toMatch(/Marquee Mondays/);
});
it('every content section carries a tool tape with its own facts, moving copy hidden, a static list for screen readers', async () => {
  const { container } = render(<App />);
  const { readFileSync } = await import('node:fs');
  for (const id of ['vantage', 'nertia', 'terpscout', 'work', 'practice'] as const) {
    const tape = container.querySelector(`#${id} > [data-part="tools"]`)!;
    expect(tape, id).not.toBeNull();
    expect([...tape.querySelectorAll('ul.sr-only li')].map((l) => l.textContent)).toEqual(COPY[id].tools);
    const moving = tape.querySelector('[aria-hidden="true"]')!;
    expect(moving.textContent).toBe(`${COPY[id].tools.join(' · ')} · `.repeat(2));
  }
  expect(container.querySelectorAll('[data-part="tools"]').length).toBe(5);
  expect(container.querySelector('#hero [data-part="tools"], #contact [data-part="tools"]')).toBeNull();
  expect(COPY.practice.tools).toEqual(['Blender', 'Ableton', 'Animation', 'DJing']);
  const css = readFileSync('src/components/ToolTape.module.css', 'utf8');
  expect(css).toMatch(/\.tape\{[^}]*transform:rotate\(-2deg\)/);
  expect(css).toMatch(/animation:tape 90s linear infinite/);
  expect(css).not.toMatch(/box-shadow|border-radius/);
  const still = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce),(prefers-reduced-data: reduce),(forced-colors: active)'));
  expect(still).toMatch(/\.track\{animation:none/);
  expect(still).toContain('.run+.run{display:none}');
});
it('the cover holds only the eyebrow, the headline and two outline actions; the Virgil row sits on the yellow pages, once', () => {
  const { container } = render(<App />);
  const cover = container.querySelector('#hero')!;
  expect(cover.querySelector('h1')!.textContent).toBe("Something Click'd");
  expect(cover.querySelector('h1')!.classList.contains('bleed-btn')).toBe(true);
  expect([...cover.querySelectorAll('a')].map((a) => a.getAttribute('data-variant'))).toEqual(['secondary', 'secondary']);
  expect(cover.querySelector('p, ul, table')).toBeNull();
  expect(cover.textContent).toContain('"I design systems agents ship."');
  const v = COPY.endpapers.virgil;
  expect(v).toEqual({ when: '2015 to 2016', who: 'Virgil', text: 'Virgil Abloh played Euphoria, Portland, the room that is 45 East now. He dapped me up in the crowd. We exchanged pleasantries, as far as club sound at 1 AM allows.' });
  expect(container.querySelector('#endpapers')!.textContent).toContain(v.text);
  expect(container.textContent!.split('dapped me up').length).toBe(2);
  expect(COPY.practice.rows[0].text).toContain('Marquee Mondays');
  expect(COPY.practice.rows[0].text).not.toContain('Virgil');
});
