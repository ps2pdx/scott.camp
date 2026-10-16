import type { Still } from '@/components/Evidence';
import { COPY } from './copy';
import FRAMES_JSON from './book-frames.json';

export type BookFrame = { frame: string; ratio: '1:1' | '2:3' | '3:2'; width: number; height: number; date: string };
export const FRAMES = FRAMES_JSON as BookFrame[];

const book = COPY.designSystem.book;
export const cut = (f: BookFrame, px: number) => `/evidence/frames/${f.frame.toLowerCase()}-${px}.webp`;
export const caption = (f: BookFrame) => `${book.name}, ${f.frame}, ${book.camera}, ${f.date}`;
export const framesLine = () => `${FRAMES.length} frames, ${book.framesMeta}`;
export const frameAlt = (f: BookFrame) => book.alts[f.frame] ?? `${book.fallbackAlt}, ${f.frame}`;
export const startIndex = () => Math.max(0, FRAMES.findIndex((f) => f.frame === book.initial));

export function bookStill(f: BookFrame = FRAMES[startIndex()]): Still {
  return { src: cut(f, 1280), srcSet: `${cut(f, 640)} 640w, ${cut(f, 1280)} 1280w`, width: f.width, height: f.height, ratio: f.ratio, caption: caption(f), alt: frameAlt(f) };
}
