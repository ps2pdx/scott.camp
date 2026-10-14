import { useState } from 'react';
import { getTheme, toggleTheme } from '@/lib/theme';
import s from './ThemeToggle.module.css';
export function ThemeToggle() {
  const [theme, setThemeState] = useState(() => getTheme());
  return (
    <button type="button" className={`meta ${s.toggle}`} onClick={() => setThemeState(toggleTheme())} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
      {`[${theme.toUpperCase()}]`}
    </button>
  );
}
