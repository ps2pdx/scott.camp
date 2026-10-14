import s from './SpineRail.module.css';
export function SpineRail() { return <div className={`rail ${s.rail}`} aria-hidden="true" />; }
export function SpineBand() { return <div className={`rail ${s.band}`} aria-hidden="true" />; }
