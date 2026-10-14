export function Label({ children }: { children: string }) {
  return <span className="meta">{`"${children}"`}</span>;
}
