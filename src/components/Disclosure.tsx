import { useRef, useState, type ReactNode } from 'react';
import s from './Disclosure.module.css';

export function Disclosure({ summary, children }: { summary: string; children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const ref = useRef<HTMLDetailsElement>(null);
  const onToggle = () => {
    const d = ref.current;
    if (!d) return;
    if (d.open) setOpened(true);
    else d.querySelectorAll('video').forEach((v) => v.pause());
  };
  return (
    <details ref={ref} className={s.disclosure} onToggle={onToggle}>
      <summary className={s.summary}>
        <span>{summary}</span>
        <span className={`meta ${s.state}`} aria-hidden="true"><span className={s.show}>Show</span><span className={s.hide}>Hide</span></span>
      </summary>
      {opened ? <div className={s.body}>{children}</div> : null}
    </details>
  );
}
