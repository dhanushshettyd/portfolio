import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { FOOTER_NAV_ITEMS, PORTFOLIO_CONFIG } from "@/data/portfolio";
import { FloatingParticles } from "./FloatingParticles";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-footer-reveal]",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-border bg-background pt-16 pb-12"
    >
      <FloatingParticles showOrbs={false} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          data-footer-reveal
          className="flex flex-col justify-between gap-10 pb-12 md:flex-row md:items-end"
        >
          <div>
            <p className="text-lg font-bold tracking-[0.18em] text-foreground">
              {PORTFOLIO_CONFIG.brandName}
            </p>
            <p className="mt-2 text-sm font-light text-text-secondary">
              {PORTFOLIO_CONFIG.tagline}
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6">
            {FOOTER_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className="text-xs font-medium tracking-wide text-text-secondary transition-colors hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={PORTFOLIO_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-all hover:border-silver hover:text-foreground"
            >
              <GithubLogo size={18} weight="light" />
            </a>
            {PORTFOLIO_CONFIG.linkedinUrl && (
              <a
                href={PORTFOLIO_CONFIG.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-all hover:border-silver hover:text-foreground"
              >
                <LinkedinLogo size={18} weight="light" />
              </a>
            )}
            <button
              type="button"
              onClick={() => onNavigate("home")}
              aria-label="Back to top"
              className="ml-2 inline-flex h-10 items-center gap-1.5 rounded-full border border-silver/40 bg-card px-4 text-xs font-medium text-foreground transition-all hover:border-silver hover:bg-surface-elevated"
            >
              <ArrowUp size={14} weight="light" />
              Top
            </button>
          </div>
        </div>

        <div
          data-footer-reveal
          className="flex flex-col items-center justify-between gap-2 border-t border-border/70 pt-6 text-xs font-light text-muted-foreground sm:flex-row"
        >
          <p>&copy; {currentYear} {PORTFOLIO_CONFIG.brandName}. All rights reserved.</p>
          <p>Bengaluru, India</p>
        </div>
      </div>
    </footer>
  );
}