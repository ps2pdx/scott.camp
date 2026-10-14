import { useSyncExternalStore } from 'react';

const QUERY = '(max-width: 639px)';
const mql = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(QUERY) : null);

function subscribe(cb: () => void) {
  const m = mql();
  m?.addEventListener('change', cb);
  return () => m?.removeEventListener('change', cb);
}

export function useNarrow(): boolean {
  return useSyncExternalStore(subscribe, () => mql()?.matches ?? false, () => false);
}
