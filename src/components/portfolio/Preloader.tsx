import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PORTFOLIO_CONFIG } from "@/data/portfolio";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setProgress(100);
      setDone(true);
      onComplete();
      return;
    }

    let finished = false;
    const finishOnce = () => {
      if (finished) return;
      finished = true;
      setDone(true);
      onComplete();
    };

    // Safety cap: never get stuck even if timers or external assets stall
    const safetyTimer = window.setTimeout(finishOnce, 2200);
    const counter = { value: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finishOnce });

      tl.fromTo(
        "[data-preloader-logo]",
        { opacity: 0, scale: 0.9, filter: "blur(12px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.35, ease: "power3.out" },
      )
        .fromTo(
          "[data-preloader-name]",
          { opacity: 0, y: 12, letterSpacing: "0.4em" },
          { opacity: 1, y: 0, letterSpacing: "0.28em", duration: 0.3, ease: "power2.out" },
          "-=0.18",
        )
        .to(
          counter,
          {
            value: 100,
            duration: 0.72,
            ease: "power2.inOut",
            onUpdate: () => setProgress(Math.round(counter.value)),
          },
          "-=0.05",
        )
        .to(
          "[data-preloader-bar]",
          { scaleX: 1, duration: 0.72, ease: "power2.inOut" },
          "<",
        )
        .to("[data-preloader-progress-wrap]", {
          opacity: 0,
          y: -6,
          duration: 0.2,
          ease: "power2.in",
        })
        .to(el, {
          opacity: 0,
          scale: 1.03,
          duration: 0.32,
          ease: "power3.inOut",
        });
    }, el);

    return () => {
      window.clearTimeout(safetyTimer);
      ctx.revert();
    };
  }, [onComplete]);

  if (done) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6"
    >
      <div className="flex flex-col items-center">
        <div
          data-preloader-logo
          className="flex h-20 w-20 items-center justify-center rounded-2xl border border-silver/30 bg-card/80 silver-glow"
        >
          <svg
            viewBox="0 0 64 64"
            className="h-11 w-11 text-foreground"
            fill="none"
            aria-hidden="true"
          >
            <rect x="6" y="6" width="52" height="52" rx="12" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.5" />
            <path
              d="M17 42V22h8.5c5.2 0 8.5 3.6 8.5 10s-3.3 10-8.5 10H17zm3.4-3.1h4.9c3.3 0 5.2-2.3 5.2-6.9s-1.9-6.9-5.2-6.9h-4.9v13.8z"
              fill="currentColor"
            />
            <path
              d="M46.5 27.3c-.4-1.6-1.9-2.6-4.1-2.6-2.1 0-3.6.9-3.6 2.4 0 1.4 1.1 2.1 3.4 2.6l2.4.5c4 .8 6 2.5 6 5.6 0 3.7-3.1 6.2-7.8 6.2-4.6 0-7.7-2.2-8.2-5.8h3.4c.4 1.9 2.1 2.9 4.8 2.9 2.5 0 4.3-1.1 4.3-2.9 0-1.4-1.1-2.2-3.5-2.7l-2.3-.5c-3.8-.8-5.8-2.4-5.8-5.4 0-3.5 2.9-5.8 7.1-5.8 4.2 0 7 2.1 7.4 5.5h-3.5z"
              fill="currentColor"
              fillOpacity="0.82"
            />
          </svg>
        </div>

        <p
          data-preloader-name
          className="mt-6 text-xs font-medium uppercase tracking-[0.28em] text-silver sm:text-sm"
        >
          {PORTFOLIO_CONFIG.brandName}
        </p>

        <div data-preloader-progress-wrap className="mt-8 w-56 sm:w-72">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-border">
            <div
              data-preloader-bar
              className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-muted-foreground via-silver to-foreground"
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-light tracking-[0.2em] text-muted-foreground">
            <span>INITIALIZING</span>
            <span className="tabular-nums text-silver">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}