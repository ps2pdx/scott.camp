import '@testing-library/jest-dom/vitest';

const jsdomWindow = (globalThis as { jsdom?: { window: Window } }).jsdom?.window;
if (jsdomWindow && typeof globalThis.localStorage?.clear !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: jsdomWindow.localStorage });
}
if (!('IntersectionObserver' in globalThis)) (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
