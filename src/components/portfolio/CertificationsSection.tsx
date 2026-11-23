import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Certificate,
  Eye,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Star,
  X,
} from "@phosphor-icons/react";
import {
  CERTIFICATES,
  HACKERRANK_SKILL_BADGE,
  filterCertificatesByCategory,
  type CertificateCategory,
  type CertificateItem,
} from "@/data/portfolio";

const CATEGORIES: readonly CertificateCategory[] = [
  "All",
  "Programming",
  "AI & Technology",
  "Events",
];

// Each certificate id points to its PDF in public/images/certificates
const CERT_FILES: Record<string, string> = {
  "ai-skills-passport": "/images/certificates/ai-skills-passport.pdf",
  "c-programming-infosys": "/images/certificates/c-programming.pdf",
  "csharp-basic-hackerrank": "/images/certificates/csharp-basic.pdf",
  "intro-unix-infosys": "/images/certificates/intro-unix.pdf",
  "intro-iot-skill-india": "/images/certificates/intro-iot.pdf",
  "codekala-3": "/images/certificates/codekala-3.pdf",
  "inventra-26-pathpulse": "/images/certificates/inventra-pathpulse.pdf",
  "nexora-techsprint-2k26": "/images/certificates/nexora-techsprint.pdf",
};

const HACKERRANK_PROFILE_URL = "https://www.hackerrank.com/profile/dhanushshettyd15";

export function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [category, setCategory] = useState<CertificateCategory>("All");
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-cert-reveal]",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!activeCert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveCert(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeCert]);

  const filtered = filterCertificatesByCategory(CERTIFICATES, category);
  const activeFile = activeCert ? CERT_FILES[activeCert.id] : undefined;

  const openCert = (cert: CertificateItem) => {
    setZoom(0.75);
    setActiveCert(cert);
  };

  return (
    <section id="certifications" ref={sectionRef} className="relative bg-surface-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
              05 / Credentials
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              Certifications &amp; Credentials.
            </h2>
            <p className="mt-4 text-base font-light text-text-secondary">
              Continuous learning, one milestone at a time.
            </p>
          </div>

          <div role="tablist" aria-label="Filter certificates by category" className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    active
                      ? "bg-foreground text-primary-foreground"
                      : "border border-border bg-card text-text-secondary hover:border-silver/60 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((cert) => (
            <article
              key={cert.id}
              data-cert-reveal
              className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-silver/60"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border bg-background">
                <div className="monochrome-grain flex h-full w-full flex-col items-center justify-center p-5 text-center">
                  <Certificate size={32} weight="light" className="text-silver/80" />
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-silver">
                    PDF Certificate
                  </p>
                </div>

                {CERT_FILES[cert.id] && (
                  <iframe
                    src={`${CERT_FILES[cert.id]}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                    title={`${cert.title} preview`}
                    loading="lazy"
                    tabIndex={-1}
                    className="pointer-events-none absolute inset-0 h-full w-full border-0 bg-white"
                  />
                )}

                <button
                  type="button"
                  onClick={() => openCert(cert)}
                  aria-label={`View ${cert.title} certificate`}
                  className="absolute inset-0 z-10 cursor-pointer"
                />

                <span className="absolute top-3 left-3 z-20 rounded-full border border-border bg-background/85 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-silver backdrop-blur-md">
                  {cert.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-medium text-silver">{cert.issuer}</p>
                <h3 className="mt-1.5 text-base font-medium leading-snug text-foreground">
                  {cert.title}
                </h3>
                <p className="mt-1 text-xs font-light text-muted-foreground">
                  {cert.type} · {cert.date}
                </p>

                <div className="mt-5 pt-2">
                  <button
                    type="button"
                    onClick={() => openCert(cert)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-foreground px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-silver"
                  >
                    <Eye size={14} weight="light" />
                    View Certificate
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* HackerRank Java 5-Star Skill Badge (distinct from course certificates) */}
        <div
          data-cert-reveal
          className="mt-12 rounded-3xl border border-silver/35 bg-background/90 p-7 sm:p-8"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-silver/40 bg-card text-foreground">
                <Star size={26} weight="fill" />
              </div>
              <div>
                <span className="rounded-full border border-border bg-card px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-silver">
                  {HACKERRANK_SKILL_BADGE.classification} · {HACKERRANK_SKILL_BADGE.issuer}
                </span>
                <h3 className="mt-2.5 text-xl font-semibold tracking-tight text-foreground">
                  {HACKERRANK_SKILL_BADGE.issuer} {HACKERRANK_SKILL_BADGE.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-xs leading-relaxed font-light text-text-secondary">
                  {HACKERRANK_SKILL_BADGE.note}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5">
                {Array.from({ length: HACKERRANK_SKILL_BADGE.stars }).map((_, idx) => (
                  <Star key={idx} size={16} weight="fill" className="text-foreground" />
                ))}
                <span className="ml-2 text-xs font-medium tracking-wider text-silver">5-STAR</span>
              </div>
              <a
                href={HACKERRANK_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-silver"
              >
                <ArrowUpRight size={14} weight="light" />
                View on HackerRank
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate viewer */}
      {activeCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeCert.title}
          onClick={() => setActiveCert(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/92 p-4 backdrop-blur-lg"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">{activeCert.title}</h3>
                <p className="text-xs font-light text-text-secondary">
                  {[activeCert.issuer, activeCert.type, activeCert.date].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))))}
                  aria-label="Zoom out"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-secondary text-silver hover:border-silver hover:text-foreground"
                >
                  <MagnifyingGlassMinus size={16} weight="light" />
                </button>
                <span className="min-w-12 text-center text-xs tabular-nums text-silver">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))}
                  aria-label="Zoom in"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-secondary text-silver hover:border-silver hover:text-foreground"
                >
                  <MagnifyingGlassPlus size={16} weight="light" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  aria-label="Close certificate preview"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-secondary text-silver hover:border-silver hover:text-foreground"
                >
                  <X size={16} weight="light" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-background p-3 sm:p-4">
              {activeFile ? (
                <iframe
                  key={`${activeCert.id}-${zoom}`}
                  src={`${activeFile}#toolbar=0&navpanes=0&zoom=${Math.round(zoom * 100)}`}
                  title={`${activeCert.title} certificate`}
                  className="h-[72vh] w-full rounded-xl border border-border bg-white"
                />
              ) : (
                <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/70 p-10 text-center">
                  <Certificate size={40} weight="light" className="mx-auto text-silver" />
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Certificate file not available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}