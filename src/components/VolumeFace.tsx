import s from './VolumeFace.module.css';
export function VolumeFace({ no, name, year, size = 'card' }: { no: string; name: string; year: string; size?: 'card' | 'og' | 'favicon' }) {
  if (size === 'favicon') return <div className={`${s.recto} ${s.favicon}`}><span className={`display ${s.vol}`}>Vol. {no}</span></div>;
  return (
    <div className={`${s.face} ${size === 'og' ? s.og : ''}`}>
      <div data-part="verso" className={`verso ${s.verso}`} />
      <div className={s.gutter} />
      <div className={s.recto}>
        <div className={s.top}><span data-part="vol" className={`vol display t-title ${s.vol}`}>Vol. {no}</span><span className={`meta ${s.yr}`}>{year}</span></div>
        <span data-part="name" className={`display t-title ${s.nm}`}>{name}</span>
      </div>
    </div>
  );
}
