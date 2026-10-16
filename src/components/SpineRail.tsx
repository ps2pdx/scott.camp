import s from './SpineRail.module.css';
export function SpineRail() { return <div data-part="rail" className={`rail ${s.rail}`} aria-hidden="true" />; }
export function SpineBand({ className }: { className?: string }) { return <div data-part="band" className={`band ${s.band} ${className ?? ''}`} aria-hidden="true" />; }
export function SpineEnd() { return <div data-part="band-end" className={`band ${s.band} ${s.end}`} aria-hidden="true" />; }
