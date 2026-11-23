import { useEffect, useRef } from "react";
import gsap from "gsap";

const PARTICLES = [
  { id: 1, top: "12%", left: "8%", size: 2, opacity: 0.45, dy: -26, dx: 12, duration: 7.5 },
  { id: 2, top: "24%", left: "22%", size: 3, opacity: 0.3, dy: 22, dx: -14, duration: 9.2 },
  { id: 3, top: "18%", left: "78%", size: 2, opacity: 0.5, dy: -30, dx: -10, duration: 8.4 },
  { id: 4, top: "42%", left: "14%", size: 2, opacity: 0.35, dy: 18, dx: 16, duration: 10.1 },
  { id: 5, top: "55%", left: "86%", size: 3, opacity: 0.4, dy: -24, dx: -16, duration: 8.8 },
  { id: 6, top: "70%", left: "28%", size: 2, opacity: 0.3, dy: -20, dx: 10, duration: 9.6 },
  { id: 7, top: "76%", left: "72%", size: 2, opacity: 0.45, dy: 24, dx: -12, duration: 7.9 },
  { id: 8, top: "88%", left: "46%", size: 3, opacity: 0.25, dy: -18, dx: 14, duration: 11.0 },
  { id: 9, top: "34%", left: "62%", size: 2, opacity: 0.35, dy: 20, dx: 8, duration: 8.1 },
  { id: 10, top: "63%", left: "51%", size: 2, opacity: 0.28, dy: -22, dx: -12, duration: 9.4 },
] as const;

interface FloatingParticlesProps {
  showOrbs?: boolean;
  className?: string;
}

export function FloatingParticles({ showOrbs = true, className = "" }: FloatingParticlesProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const dots = el.querySelectorAll<HTMLElement>("[data-particle]");
      dots.forEach((dot, idx) => {
        const config = PARTICLES[idx];
        if (!config) return;
        gsap.to(dot, {
          y: config.dy,
          x: config.dx,
          opacity: Math.min(0.85, config.opacity + 0.3),
          duration: config.duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: idx * 0.35,
        });
      });

      if (showOrbs) {
        gsap.to("[data-orb='left']", {
          y: -28,
          x: 18,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("[data-orb='right']", {
          y: 24,
          x: -22,
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, el);

    return () => ctx.revert();
  }, [showOrbs]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {showOrbs && (
        <>
          <div
            data-orb="left"
            className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-silver/6 blur-3xl"
          />
          <div
            data-orb="right"
            className="absolute -right-24 bottom-12 h-96 w-96 rounded-full bg-foreground/5 blur-3xl"
          />
        </>
      )}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          data-particle
          className="absolute rounded-full bg-silver"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}