import { useState } from 'react';
import { getTheme, toggleTheme } from '@/lib/theme';
export function ThemeToggle() {
  const [theme, setThemeState] = useState(() => getTheme());
  return (
    <button type="button" className="meta" onClick={() => setThemeState(toggleTheme())} style={{ background: 'none', border: 0, padding: 0, color: 'inherit', cursor: 'pointer' }} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
      {`[${theme.toUpperCase()}]`}
    </button>
  );
}
