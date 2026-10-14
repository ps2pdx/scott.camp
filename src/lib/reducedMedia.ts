import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce), (prefers-reduced-data: reduce)';
const mql = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(QUERY) : null);

function subscribe(cb: () => void) {
  const m = mql();
  m?.addEventListener('change', cb);
  return () => m?.removeEventListener('change', cb);
}

export function useStillOnly(): boolean {
  return useSyncExternalStore(subscribe, () => mql()?.matches ?? false, () => true);
}
