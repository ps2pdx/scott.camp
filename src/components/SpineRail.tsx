import s from './SpineRail.module.css';
export function SpineRail() { return <div data-part="rail" className={`rail ${s.rail}`} aria-hidden="true" />; }
export function SpineReveal() { return <div data-part="reveal" className={`reveal ${s.reveal}`} aria-hidden="true" />; }
export function SpineBand({ className }: { className?: string }) { return <div data-part="band" className={`band ${s.band} ${className ?? ''}`} aria-hidden="true" />; }
