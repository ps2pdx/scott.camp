import { useEffect, useRef } from 'react';
import { useStillOnly } from '@/lib/reducedMedia';

export type EvidenceClip = { src: string; poster: string; width: number; height: number; alt: string };

export function EvidenceVideo({ clip, className }: { clip: EvidenceClip; className?: string }) {
  const still = useStillOnly();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [still]);

  if (still) return <img className={className} src={clip.poster} width={clip.width} height={clip.height} alt={clip.alt} loading="lazy" decoding="async" />;
  return (
    <video ref={ref} className={className} poster={clip.poster} width={clip.width} height={clip.height} muted loop playsInline preload="none" aria-label={clip.alt}>
      <source src={clip.src} type="video/mp4" />
    </video>
  );
}
