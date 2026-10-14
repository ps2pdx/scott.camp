export function Bracket({ children, className }: { children: string; className?: string }) {
  return <span className={className ?? 'meta'}>{`[${children}]`}</span>;
}
