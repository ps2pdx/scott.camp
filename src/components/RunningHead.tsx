export function RunningHead({ children }: { children: string }) {
  return <div className="meta muted" style={{ whiteSpace: 'nowrap' }}>{children}</div>;
}
