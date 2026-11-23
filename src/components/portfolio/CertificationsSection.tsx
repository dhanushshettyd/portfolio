import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Certificate,
  DownloadSimple,
  Eye,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Star,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { toast } from "sonner";
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

interface UploadedCertificateFile {
  dataUrl: string;
  fileName: string;
  mimeType: string;
}

const STORAGE_KEY = "ds-portfolio-uploaded-certs-v1";

export function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<CertificateCategory>("All");
  const [uploads, setUploads] = useState<Record<string, UploadedCertificateFile>>({});
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUploads(JSON.parse(raw) as Record<string, UploadedCertificateFile>);
    } catch {
      // ignore storage errors
    }
  }, []);

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

  const triggerUpload = (certId: string) => {
    setUploadTargetId(certId);
    uploadInputRef.current?.click();
  };

  const handleFileChange = (file: File | undefined) => {
    if (!file || !uploadTargetId) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (!dataUrl) return;
      const entry: UploadedCertificateFile = {
        dataUrl,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
      };
      setUploads((prev) => {
        const next = { ...prev, [uploadTargetId]: entry };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // file too large for localStorage; keep in session memory
        }
        return next;
      });
      toast.success("Certificate file attached", {
        description: `${file.name} is ready to view and download.`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (cert: CertificateItem) => {
    const uploaded = uploads[cert.id];
    if (!uploaded) {
      toast("Original certificate file not uploaded yet", {
        description: "Upload the original image or PDF first to enable downloading.",
      });
      return;
    }
    const a = document.createElement("a");
    a.href = uploaded.dataUrl;
    a.download = uploaded.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const activeUpload = activeCert ? uploads[activeCert.id] : undefined;

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

        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            handleFileChange(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((cert) => {
            const uploaded = uploads[cert.id];
            const isImage = uploaded?.mimeType.startsWith("image/");
            return (
              <article
                key={cert.id}
                data-cert-reveal
                className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-silver/60"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border bg-background">
                  {uploaded && isImage ? (
                    <img
                      src={uploaded.dataUrl}
                      alt={`${cert.title} certificate`}
                      className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="monochrome-grain flex h-full w-full flex-col items-center justify-center p-5 text-center">
                      <Certificate size={28} weight="light" className="text-silver/70" />
                      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-silver">
                        {uploaded ? uploaded.fileName : "Original File Placeholder"}
                      </p>
                      <p className="mt-1 text-[11px] font-light text-muted-foreground">
                        {uploaded ? "PDF attached — click View" : "Attach original certificate file"}
                      </p>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 rounded-full border border-border bg-background/85 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-silver backdrop-blur-md">
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

                  <div className="mt-5 flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setActiveCert(cert);
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-silver"
                    >
                      <Eye size={14} weight="light" />
                      View Certificate
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerUpload(cert.id)}
                      aria-label={`Upload original file for ${cert.title}`}
                      title="Attach original certificate file"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-elevated text-silver transition-colors hover:border-silver hover:text-foreground"
                    >
                      <UploadSimple size={14} weight="light" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
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

            <div className="flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-4 py-2.5 md:self-center">
              {Array.from({ length: HACKERRANK_SKILL_BADGE.stars }).map((_, idx) => (
                <Star key={idx} size={16} weight="fill" className="text-foreground" />
              ))}
              <span className="ml-2 text-xs font-medium tracking-wider text-silver">5-STAR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal with Zoom & Download */}
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
            className="glass-panel flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">{activeCert.title}</h3>
                <p className="text-xs font-light text-text-secondary">
                  {activeCert.issuer} · {activeCert.type} · {activeCert.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.25).toFixed(2))))}
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
                  onClick={() => triggerUpload(activeCert.id)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-3.5 text-xs font-medium text-silver hover:border-silver hover:text-foreground"
                >
                  <UploadSimple size={14} weight="light" />
                  {activeUpload ? "Replace File" : "Upload File"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(activeCert)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-medium text-primary-foreground hover:bg-silver"
                >
                  <DownloadSimple size={14} weight="light" />
                  Download
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

            <div className="flex flex-1 items-center justify-center overflow-auto bg-background p-8">
              {activeUpload && activeUpload.mimeType.startsWith("image/") ? (
                <img
                  src={activeUpload.dataUrl}
                  alt={`${activeCert.title} full certificate`}
                  style={{ transform: `scale(${zoom})` }}
                  className="max-h-[64vh] origin-center rounded-xl border border-border object-contain transition-transform duration-200"
                />
              ) : (
                <div className="max-w-md rounded-2xl border border-dashed border-border bg-card/70 p-10 text-center">
                  <Certificate size={40} weight="light" className="mx-auto text-silver" />
                  <p className="mt-4 text-sm font-medium text-foreground">
                    {activeUpload
                      ? `Attached: ${activeUpload.fileName}`
                      : "Original Certificate Not Uploaded Yet"}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed font-light text-text-secondary">
                    {activeUpload
                      ? "Use the Download button above to save the attached original document."
                      : "No synthetic certificate is displayed here. Attach your original certificate image or PDF to inspect and download it."}
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