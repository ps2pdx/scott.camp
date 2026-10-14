export type Theme = 'dark' | 'light';

export function getTheme(): Theme {
  const set = document.documentElement.getAttribute('data-theme');
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function setTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('theme', t); } catch { /* storage may be unavailable */ }
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
