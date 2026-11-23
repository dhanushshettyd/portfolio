import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Buildings, Compass, GraduationCap, MapPin } from "@phosphor-icons/react";
import { ABOUT_INFO_CARDS, PORTFOLIO_CONFIG } from "@/data/portfolio";

const ICON_MAP = {
  graduation: GraduationCap,
  buildings: Buildings,
  mapPin: MapPin,
  compass: Compass,
} as const;

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-about-reveal]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 8, ry: px * 8 });
  };

  return (
    <section id="about" ref={sectionRef} className="relative bg-surface-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-about-reveal className="mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
            01 / About Me
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
            Beyond the Code.
          </h2>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-about-reveal className="lg:col-span-5">
            <div
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
              style={{
                transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              }}
              className="group relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-3xl border border-silver/30 bg-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-silver/70 hover:shadow-[0_0_55px_-12px_oklch(1_0_0_/_26%)]"
            >
              <img
                src={PORTFOLIO_CONFIG.profileImageUrl}
                alt="Dhanush Shetty D portrait"
                className="h-full w-full object-cover object-top grayscale contrast-110 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
          </div>

          <div data-about-reveal className="lg:col-span-7">
            <h3 className="text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
              Hello, I&apos;m Dhanush Shetty.
            </h3>

            <div className="mt-6 space-y-4 text-base leading-relaxed font-light text-text-secondary">
              <p>
                I&apos;m a Computer and Communication Engineering student at KS Institute of
                Technology, Bengaluru. I&apos;m passionate about software development, artificial
                intelligence, cybersecurity and physical computing.
              </p>
              <p>
                I enjoy transforming ideas into practical solutions, participating in hackathons
                and building projects that combine software with hardware.
              </p>
              <p>
                My goal is to continuously improve my technical and communication skills while
                developing innovative products and real-world solutions.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {ABOUT_INFO_CARDS.map((card) => {
                const Icon = ICON_MAP[card.icon];
                return (
                  <div
                    key={card.label}
                    className="glass-panel rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-silver/50"
                  >
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Icon size={18} weight="light" className="text-silver" />
                      <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
                        {card.label}
                      </span>
                    </div>
                    <p className="mt-2.5 text-sm leading-snug font-medium text-foreground">
                      {card.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}