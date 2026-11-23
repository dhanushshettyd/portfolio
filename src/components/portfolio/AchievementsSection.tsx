import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CalendarBlank,
  Certificate,
  MapPin,
  Medal,
  Sparkle,
} from "@phosphor-icons/react";
import { FEATURED_ACHIEVEMENT, OTHER_ACHIEVEMENTS } from "@/data/portfolio";

interface AchievementsSectionProps {
  onNavigate: (sectionId: string) => void;
}

export function AchievementsSection({ onNavigate }: AchievementsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-achievement-reveal]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 76%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="achievements" ref={sectionRef} className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
            04 / Recognition
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
            Milestones &amp; Recognition.
          </h2>
          <p className="mt-4 text-base font-light text-text-secondary">
            Every achievement represents an opportunity to learn, build and grow.
          </p>
        </div>

        {/* Featured Winning Award */}
        <div
          data-achievement-reveal
          className="animated-silver-frame mt-14 rounded-[2rem] p-[1px] silver-glow"
        >
          <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-background p-8 sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                    <Sparkle size={12} weight="fill" />
                    {FEATURED_ACHIEVEMENT.tier}
                  </span>
                  <span className="rounded-full border border-border bg-card px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-silver">
                    {FEATURED_ACHIEVEMENT.format}
                  </span>
                </div>

                <p className="mt-6 text-xs font-medium uppercase tracking-[0.26em] text-silver">
                  {FEATURED_ACHIEVEMENT.event}
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
                  {FEATURED_ACHIEVEMENT.award}
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed font-light text-text-secondary">
                  Awarded for <span className="font-medium text-foreground">{FEATURED_ACHIEVEMENT.project}</span> —{" "}
                  {FEATURED_ACHIEVEMENT.recognition}.
                </p>

                <div className="mt-8 flex flex-wrap gap-6 border-t border-border/80 pt-6 text-xs text-silver">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} weight="light" className="text-muted-foreground" />
                    <span>{FEATURED_ACHIEVEMENT.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarBlank size={16} weight="light" className="text-muted-foreground" />
                    <span>{FEATURED_ACHIEVEMENT.date}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => onNavigate("certifications")}
                    className="inline-flex items-center gap-2 rounded-full border border-silver/45 bg-card px-5 py-2.5 text-xs font-medium text-foreground transition-all hover:border-silver hover:bg-surface-elevated"
                  >
                    <Certificate size={15} weight="light" />
                    View Credentials Gallery
                    <ArrowUpRight size={14} weight="light" />
                  </button>
                </div>
              </div>

              {/* Metallic Silver Trophy Illustration */}
              <div className="flex items-center justify-center lg:col-span-4">
                <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-silver/25 bg-gradient-to-b from-surface-elevated/70 to-background sm:h-64 sm:w-64">
                  <svg
                    viewBox="0 0 160 160"
                    className="h-36 w-36"
                    fill="none"
                    aria-label="Metallic silver trophy illustration"
                  >
                    <defs>
                      <linearGradient id="silverMetal" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="45%" stopColor="#D4D4D4" />
                        <stop offset="100%" stopColor="#525252" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M48 34h64v24c0 22-14.3 38-32 38S48 80 48 58V34z"
                      stroke="url(#silverMetal)"
                      strokeWidth="2.5"
                      fill="url(#silverMetal)"
                      fillOpacity="0.14"
                    />
                    <path
                      d="M48 44H32c0 16 6.5 27 17.5 30M112 44h16c0 16-6.5 27-17.5 30"
                      stroke="url(#silverMetal)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M80 96v22M60 118h40M52 130h56"
                      stroke="url(#silverMetal)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <polygon
                      points="80,47 83.8,55.2 92.8,56.2 86,62.4 87.8,71.2 80,66.8 72.2,71.2 74,62.4 67.2,56.2 76.2,55.2"
                      fill="url(#silverMetal)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Participation & Appreciation Recognition */}
        <div className="mt-14">
          <p
            data-achievement-reveal
            className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground"
          >
            Appreciation &amp; Participation Certificates
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {OTHER_ACHIEVEMENTS.map((item) => (
              <article
                key={item.title}
                data-achievement-reveal
                className="glass-panel rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-silver/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold tracking-tight text-silver/40 tabular-nums">
                    {item.number}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-text-secondary">
                    <Medal size={13} weight="light" className="text-silver" />
                    {item.tier}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs font-light text-text-secondary">{item.organizer}</p>
                <p className="mt-4 border-t border-border/60 pt-3 text-[11px] font-light tracking-wide text-muted-foreground">
                  {item.date}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}