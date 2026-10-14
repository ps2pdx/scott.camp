import s from './SpineRail.module.css';
export function SpineRail() { return <div data-part="rail" className={`rail ${s.rail}`} aria-hidden="true" />; }
export function SpineBand() { return <div data-part="band" className={`band ${s.band}`} aria-hidden="true" />; }
