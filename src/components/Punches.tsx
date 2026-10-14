import s from './Punches.module.css';
export function PunchFilterDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <pattern id="gp" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#9fb7c9" strokeWidth="0.5" /></pattern>
        <filter id="punch" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
export function Punches({ className }: { className?: string }) {
  return <div className={`${s.row} ${className ?? ''}`} aria-hidden="true"><span className={`hole ${s.hole}`} /><span className={`hole ${s.hole}`} /><span className={`hole ${s.hole}`} /></div>;
}
