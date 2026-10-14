import s from './RunningHead.module.css';
export function RunningHead({ children }: { children: string }) {
  return <div className={`meta muted ${s.head}`}>{children}</div>;
}
