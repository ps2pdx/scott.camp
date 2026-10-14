import type { ReactNode } from 'react';
import s from './Button.module.css';
export function Button({ href, variant, children, bracket, download }: { href: string; variant: 'primary' | 'secondary'; children: ReactNode; bracket?: string; download?: boolean }) {
  const cls = variant === 'primary' ? `chip bleed-btn ${s.btn} ${s.primary}` : `${s.btn} ${s.secondary}`;
  return <a className={cls} data-variant={variant} href={href} {...(download ? { download: true } : {})}>{children}{bracket ? ` [${bracket}]` : ''}</a>;
}
