import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CheckCircle,
  GithubLogo,
  Trophy,
  UploadSimple,
} from "@phosphor-icons/react";
import { PROJECTS, type ProjectItem } from "@/data/portfolio";

const STORAGE_PREFIX = "ds-portfolio-project-img-";

function ProjectCard({ project }: { project: ProjectItem }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(project.imageUrl);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${project.id}`);
      if (saved) setPreviewUrl(saved);
    } catch {
      // ignore storage errors
    }
  }, [project.id]);

  const handleUpload = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) return;
      setPreviewUrl(result);
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${project.id}`, result);
      } catch {
        // ignore quota errors
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <article
      data-project-card
      className="glass-panel group flex w-[84vw] shrink-0 snap-center flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:border-silver/65 hover:shadow-[0_24px_60px_-24px_oklch(0_0_0_/_95%),0_0_32px_-12px_oklch(0.87_0_0_/_24%)] sm:w-auto sm:shrink"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-background">
        <img
          src={previewUrl}
          alt={`${project.title} project showcase`}
          loading="lazy"
          className="h-full w-full object-cover object-top grayscale contrast-105 transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-background/20" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="rounded-full border border-silver/35 bg-background/85 px-3 py-1 text-xs font-medium tracking-[0.18em] text-silver backdrop-blur-md">
            {project.number}
          </span>
          {project.achievement && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-silver/50 bg-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              <Trophy size={12} weight="fill" />
              Merit Winner
            </span>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/85 px-3 py-1.5 text-[11px] font-medium text-silver opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 focus:opacity-100 hover:border-silver hover:text-foreground"
        >
          <UploadSimple size={13} weight="light" />
          Replace Preview
        </button>
      </div>

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {project.category}
        </p>

        <h3 className="mt-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {project.title}
        </h3>

        {project.achievement && (
          <p className="mt-2 text-xs font-medium tracking-[0.12em] text-silver">
            {project.achievement}
          </p>
        )}

        <p className="mt-4 text-sm leading-relaxed font-light text-text-secondary">
          {project.description}
        </p>

        <ul className="mt-5 grid gap-2 border-t border-border/70 pt-5 sm:grid-cols-2">
          {project.features.map((feat) => (
            <li key={feat} className="flex items-start gap-2 text-xs font-light text-silver">
              <CheckCircle size={14} weight="light" className="mt-0.5 shrink-0 text-muted-foreground" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-surface-secondary px-3 py-1 text-[11px] font-normal text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-medium text-primary-foreground transition-all hover:scale-[1.03] hover:bg-silver"
            >
              Live Project
              <ArrowUpRight size={15} weight="light" />
            </a>
          )}

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated/80 px-5 py-2.5 text-xs font-medium text-foreground transition-all hover:scale-[1.03] hover:border-silver/70"
          >
            <GithubLogo size={15} weight="light" />
            GitHub Repository
          </a>
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-project-card]",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 76%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative overflow-x-clip bg-surface-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
            03 / Selected Work
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
            Things I&apos;ve Built.
          </h2>
          <p className="mt-4 text-base font-light text-text-secondary">
            Turning ideas into practical solutions through technology.
          </p>
        </div>

        <div className="mt-14 flex w-full snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}