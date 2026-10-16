import type { ReactNode } from 'react';
import { PAGES, pageHref, type PageId } from '@/content/copy';
import { Section } from './Section';
import s from './Snippet.module.css';

export const lede = (text: string, sentences: number) => text.split(/(?<=\.)\s+(?=[A-Z])/).slice(0, sentences).join(' ');
export const snippetClass = { portrait: s.portrait } as const;

export function Snippet({ page, eyebrow, runningHead, title, lead, surface, children }: {
  page: Exclude<PageId, 'hero'>; eyebrow?: string; runningHead?: string; title: string; lead?: string; surface?: 'page' | 'board'; children: ReactNode;
}) {
  const label = PAGES.find((x) => x.id === page)!.label;
  return (
    <Section id={`snippet-${page}`} eyebrow={eyebrow} runningHead={runningHead} title={title} lead={lead} surface={surface}>
      <div className={s.body} data-part="snippet" data-page={page}>
        {children}
        <p className="meta"><a className={s.continue} href={pageHref(page)} aria-label={`Continue to ${label}`}>Continue</a></p>
      </div>
    </Section>
  );
}
