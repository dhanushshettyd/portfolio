import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Brain,
  Code,
  Cpu,
  Globe,
  TerminalWindow,
  Wrench,
} from "@phosphor-icons/react";
import { SKILL_GROUPS } from "@/data/portfolio";

const GROUP_ICON_MAP: Record<string, typeof Code> = {
  languages: Code,
  web: Globe,
  tools: Wrench,
  exploring: Brain,
};

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-skill-card]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const activeGroups = SKILL_GROUPS.filter((g) => g.status === "Active");
  const exploringGroup = SKILL_GROUPS.find((g) => g.status === "Exploring");

  return (
    <section id="skills" ref={sectionRef} className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
              02 / Capabilities
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              My Technical Arsenal.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-silver/40 bg-card px-3.5 py-1.5 text-silver">
              <TerminalWindow size={14} weight="light" />
              Active Foundation
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-surface-secondary px-3.5 py-1.5 text-text-secondary">
              <Cpu size={14} weight="light" />
              Currently Exploring
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {activeGroups.map((group) => {
            const Icon = GROUP_ICON_MAP[group.id] ?? Code;
            return (
              <article
                key={group.id}
                data-skill-card
                className="glass-panel group rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-silver/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface-elevated text-silver transition-colors group-hover:border-silver/50 group-hover:text-foreground">
                    <Icon size={22} weight="light" />
                  </div>
                  <span className="rounded-full border border-border bg-surface-secondary px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-silver">
                    Using
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-medium tracking-tight text-foreground">
                  {group.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed font-light text-muted-foreground">
                  {group.subtitle}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-border/90 bg-surface-secondary/90 px-3.5 py-1.5 text-xs font-normal text-foreground transition-all hover:border-silver/70 hover:bg-surface-elevated"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {exploringGroup && (
          <article
            data-skill-card
            className="mt-6 rounded-3xl border border-dashed border-border bg-surface-secondary/75 p-7 transition-all duration-300 hover:border-silver/50 sm:p-9"
          >
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-text-secondary">
                  <Brain size={14} weight="light" />
                  Learning Frontier — Not Advanced Expertise Yet
                </div>
                <h3 className="mt-4 text-2xl font-medium tracking-tight text-foreground">
                  {exploringGroup.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed font-light text-text-secondary">
                  {exploringGroup.subtitle}
                </p>
              </div>

              <ul className="flex flex-wrap gap-2.5 lg:max-w-xl lg:justify-end">
                {exploringGroup.items.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-dashed border-silver/35 bg-background/70 px-4 py-2 text-xs font-light tracking-wide text-silver transition-colors hover:border-silver hover:text-foreground"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}