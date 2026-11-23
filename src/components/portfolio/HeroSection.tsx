import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight, EnvelopeSimple } from "@phosphor-icons/react";
import { PORTFOLIO_CONFIG } from "@/data/portfolio";
import { FloatingParticles } from "./FloatingParticles";

interface HeroSectionProps {
  ready: boolean;
  onNavigate: (sectionId: string) => void;
}

export function HeroSection({ ready, onNavigate }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineFailed, setSplineFailed] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-hero-status]",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55 },
      )
        .fromTo(
          "[data-hero-headline]",
          { opacity: 0, y: 50, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 },
          "-=0.3",
        )
        .fromTo(
          "[data-hero-sub]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 },
          "-=0.45",
        )
        .fromTo(
          "[data-hero-cta]",
          { opacity: 0, scale: 0.94, y: 14 },
          { opacity: 1, scale: 1, y: 0, duration: 0.55, stagger: 0.1 },
          "-=0.35",
        )
        .fromTo(
          "[data-hero-spline]",
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 1.0 },
          "-=0.7",
        );
    }, el);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-background pt-28 pb-20"
    >
      <div aria-hidden="true" className="architectural-grid pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden="true" className="silver-beam pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
      <FloatingParticles showOrbs />

      {/* Spline 3D Black-Hole Layer with Static Monochrome Orbital Fallback */}
      <div
        data-hero-spline
        className="pointer-events-none absolute inset-0 flex items-center justify-center lg:left-[22%]"
      >
        <div className="relative h-full w-full">
          {/* Static monochrome black-hole orbital fallback */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              splineLoaded && !splineFailed ? "opacity-20" : "opacity-100"
            }`}
          >
            <div className="relative h-[340px] w-[340px] sm:h-[480px] sm:w-[480px] lg:h-[600px] lg:w-[600px]">
              <div className="absolute inset-0 rounded-full border border-silver/15" />
              <div className="absolute inset-8 rounded-full border border-silver/20" />
              <div className="absolute inset-20 rounded-full border border-silver/25 bg-radial from-foreground/10 via-background to-background" />
              <div className="absolute inset-32 rounded-full bg-background shadow-[0_0_80px_12px_oklch(0.87_0_0_/_18%)]" />
            </div>
          </div>

          {!splineFailed && (
            <iframe
              title="Interactive 3D black hole scene"
              src={PORTFOLIO_CONFIG.splineSceneUrl}
              loading="eager"
              onLoad={() => setSplineLoaded(true)}
              onError={() => setSplineFailed(true)}
              className={`pointer-events-none h-full w-full border-0 grayscale contrast-125 transition-opacity duration-1000 ${
                splineLoaded ? "opacity-80" : "opacity-0"
              }`}
            />
          )}

          {/* Readability gradient masks blending Spline seamlessly into #080808 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div
            data-hero-status
            className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/75 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-silver backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
            OPEN TO WORK
          </div>

          <h1
            data-hero-headline
            className="mt-8 text-5xl font-bold tracking-[-0.04em] text-foreground sm:text-7xl lg:text-[5.25rem] lg:leading-[1.02]"
          >
            Hi, I&apos;m Dhanush.
          </h1>

          <p
            data-hero-sub
            className="mt-5 text-xl font-medium tracking-[-0.02em] text-silver sm:text-2xl"
          >
            Developer. Engineer. Problem Solver.
          </p>

          <p
            data-hero-sub
            className="mt-5 max-w-xl text-base leading-relaxed font-light text-text-secondary sm:text-lg"
          >
            I&apos;m an engineering student passionate about building meaningful digital
            experiences and innovative technology solutions. I enjoy exploring software
            development, AI and hardware-based projects.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              data-hero-cta
              type="button"
              onClick={() => onNavigate("projects")}
              className="group inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.03] hover:bg-silver silver-glow"
            >
              Explore My Work
              <ArrowUpRight
                size={17}
                weight="light"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>

            <button
              data-hero-cta
              type="button"
              onClick={() => onNavigate("contact")}
              className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:scale-[1.03] hover:border-silver/60 hover:bg-surface-elevated"
            >
              <EnvelopeSimple size={17} weight="light" />
              Let&apos;s Connect
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onNavigate("about")}
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-muted-foreground transition-colors hover:text-silver"
      >
        <span>Scroll</span>
        <ArrowDown size={15} weight="light" className="animate-bounce" />
      </button>
    </section>
  );
}