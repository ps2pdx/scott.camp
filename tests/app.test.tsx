import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { App } from '@/App';
import { COPY, SECTIONS } from '@/content/copy';

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });

it('renders the seven sections in order with running heads', () => {
  const { container } = render(<App />);
  expect([...container.querySelectorAll('section')].map((s) => s.id)).toEqual(SECTIONS.map((s) => s.id));
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
it('places eight tech sheets and fourteen index rows', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('figure svg[role="img"]').length).toBe(8);
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
