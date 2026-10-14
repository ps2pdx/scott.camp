import { useEffect, useState } from 'react';
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join('|');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const seen = new Map<string, number>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set((e.target as HTMLElement).id, e.isIntersecting ? e.intersectionRatio : 0);
      const best = [...seen.entries()].sort((a, b) => b[1] - a[1])[0];
      if (best && best[1] > 0) setActive(best[0]);
    }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.1, 0.5, 1] });
    for (const id of key.split('|')) { const el = document.getElementById(id); if (el) io.observe(el); }
    return () => io.disconnect();
  }, [key]);
  return active;
}
