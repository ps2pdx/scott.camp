import { render, screen, fireEvent } from '@testing-library/react';
import { Label } from '@/components/Label';
import { Bracket } from '@/components/Bracket';
import { Transcript } from '@/components/Transcript';
import { Section } from '@/components/Section';
import { Grid } from '@/components/Grid';
import { Button } from '@/components/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getTheme } from '@/lib/theme';

it('Label wraps in straight quotes, Bracket in square brackets', () => {
  render(<><Label>Portland, Oregon</Label><Bracket>PDF</Bracket></>);
  expect(screen.getByText('"Portland, Oregon"')).toBeInTheDocument();
  expect(screen.getByText('[PDF]')).toBeInTheDocument();
});
it('Transcript renders rows with when and who in the left column', () => {
  render(<Transcript rows={[{ when: '2016', who: 'Brand', text: 'A line.' }]} />);
  expect(screen.getByText('A line.')).toBeInTheDocument();
  expect(screen.getByText(/2016/)).toHaveAttribute('data-part', 'when');
});
it('Section renders id, running head and a rule-less first section', () => {
  const { container } = render(<Section id="hero" runningHead="Portland, Oregon" first><p>x</p></Section>);
  const section = container.querySelector('section');
  expect(section).toHaveAttribute('id', 'hero');
  expect(screen.getByText('Portland, Oregon')).toBeInTheDocument();
  expect(section).toHaveAttribute('data-first');
});
it('Grid of four marks the fourth child as the span', () => {
  const { container } = render(<Grid columns={3}><i /><i /><i /><i /></Grid>);
  const cells = container.querySelectorAll('[data-part="cell"]');
  expect(cells.length).toBe(4);
  expect(cells[3]).toHaveAttribute('data-span');
  expect(container.querySelectorAll('[data-span]').length).toBe(1);
});
it('Grid of five lays out three plus two and closes the row with an empty cell', () => {
  const { container } = render(<Grid columns={3}><i /><i /><i /><i /><i /></Grid>);
  expect(container.querySelectorAll('[data-part="cell"]').length).toBe(5);
  expect(container.querySelectorAll('[data-span]').length).toBe(0);
  expect(container.querySelector('[data-part="filler"]')).toHaveAttribute('aria-hidden', 'true');
});
it('Button is a real link with the primary variant and a bracket', () => {
  render(<Button href="/r.pdf" variant="primary" bracket="PDF">Resume</Button>);
  const a = screen.getByRole('link', { name: 'Resume [PDF]' });
  expect(a).toHaveAttribute('href', '/r.pdf');
  expect(a).toHaveAttribute('data-variant', 'primary');
});
it('ThemeToggle flips data-theme and localStorage', () => {
  localStorage.clear(); document.documentElement.removeAttribute('data-theme');
  render(<ThemeToggle />);
  const before = getTheme();
  fireEvent.click(screen.getByRole('button'));
  expect(getTheme()).not.toBe(before);
  expect(document.documentElement.getAttribute('data-theme')).toBe(getTheme());
  expect(localStorage.getItem('theme')).toBe(getTheme());
});
