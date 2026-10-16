import type { ReactNode } from 'react';
import s from './Button.module.css';
export function Button({ href, variant, children, bracket, download, newTab }: { href: string; variant: 'primary' | 'secondary'; children: ReactNode; bracket?: string; download?: boolean; newTab?: boolean }) {
  const cls = variant === 'primary' ? `meta chip bleed-btn ${s.btn} ${s.primary}` : `meta ${s.btn} ${s.secondary}`;
  return <a className={cls} data-variant={variant} href={href} {...(download ? { download: true } : {})}{...(newTab ? { target: '_blank', rel: 'noopener' } : {})}>{children}{bracket ? ` [${bracket}]` : ''}{newTab ? <span className={s.arrow} aria-hidden="true">{' ↗'}</span> : null}</a>;
}
