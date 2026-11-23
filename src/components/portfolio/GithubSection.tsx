import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowClockwise,
  ArrowUpRight,
  GitBranch,
  GitFork,
  GithubLogo,
  Star,
  Users,
  WarningCircle,
} from "@phosphor-icons/react";
import { PORTFOLIO_CONFIG } from "@/data/portfolio";
import { getGithubPortfolio, type GithubContributionDayDTO } from "@/lib/portfolio.functions";

const LEVEL_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-surface-elevated/55",
  1: "bg-muted-foreground/45",
  2: "bg-text-secondary/65",
  3: "bg-silver/85",
  4: "bg-foreground",
};

function groupIntoWeeks(days: GithubContributionDayDTO[]): GithubContributionDayDTO[][] {
  const weeks: GithubContributionDayDTO[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function GithubSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredDay, setHoveredDay] = useState<GithubContributionDayDTO | null>(null);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["github-portfolio", PORTFOLIO_CONFIG.githubUsername],
    queryFn: () => getGithubPortfolio(),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-github-reveal]",
        { opacity: 0, y: 36 },
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

  const profile = data?.profile ?? null;
  const repos = data?.repos ?? [];
  const contributions = data?.contributions ?? null;
  const weeks = contributions ? groupIntoWeeks(contributions.days) : [];
  const hasFailure = isError || (data && !data.ok);

  return (
    <section id="github" ref={sectionRef} className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          data-github-reveal
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
              06 / Open Source &amp; Activity
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              Code. Commit. Create.
            </h2>
          </div>
          <a
            href={PORTFOLIO_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-full border border-silver/45 bg-card px-5 py-2.5 text-xs font-medium text-foreground transition-all hover:scale-[1.02] hover:border-silver hover:bg-surface-elevated md:self-auto"
          >
            <GithubLogo size={16} weight="light" />
            View GitHub Profile
            <ArrowUpRight size={14} weight="light" />
          </a>
        </div>

        {isPending ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="glass-panel h-48 animate-pulse rounded-3xl lg:col-span-4" />
            <div className="glass-panel h-48 animate-pulse rounded-3xl lg:col-span-8" />
          </div>
        ) : hasFailure ? (
          <div className="glass-panel mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl p-8 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-4">
              <WarningCircle size={28} weight="light" className="shrink-0 text-silver" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Live GitHub activity temporarily unavailable
                </p>
                <p className="mt-1 text-xs font-light text-text-secondary">
                  {data?.error ??
                    "Could not fetch live repository data. No statistics have been fabricated."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-foreground hover:border-silver"
            >
              <ArrowClockwise size={14} weight="light" />
              Retry
            </button>
          </div>
        ) : (
          <>
            <div data-github-reveal className="mt-12 grid gap-6 lg:grid-cols-12">
              {/* Profile & Live Metrics */}
              <div className="glass-panel flex flex-col justify-between rounded-3xl p-7 lg:col-span-4">
                <div className="flex items-center gap-4">
                  {profile?.avatarUrl && (
                    <img
                      src={profile.avatarUrl}
                      alt={`${profile.login} GitHub avatar`}
                      className="h-16 w-16 rounded-2xl border border-silver/35 object-cover grayscale"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {profile?.name ?? profile?.login ?? PORTFOLIO_CONFIG.githubUsername}
                    </h3>
                    <p className="text-xs font-light text-muted-foreground">
                      @{profile?.login ?? PORTFOLIO_CONFIG.githubUsername}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border/80 pt-6">
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-foreground">
                      {profile?.publicRepos ?? 0}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-light text-muted-foreground">
                      <GitBranch size={12} weight="light" />
                      Repos
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-foreground">
                      {profile?.followers ?? 0}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-light text-muted-foreground">
                      <Users size={12} weight="light" />
                      Followers
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-foreground">
                      {contributions ? contributions.totalLastYear : "—"}
                    </p>
                    <p className="mt-1 text-[11px] font-light text-muted-foreground">
                      Past Year
                    </p>
                  </div>
                </div>
              </div>

              {/* Monochrome Contribution Graph */}
              <div className="glass-panel flex flex-col justify-between rounded-3xl p-7 lg:col-span-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Public Contribution Activity
                    </h3>
                    <p className="mt-0.5 text-xs font-light text-muted-foreground">
                      {hoveredDay
                        ? `${hoveredDay.count} contribution${hoveredDay.count === 1 ? "" : "s"} on ${hoveredDay.date}`
                        : contributions
                          ? `${contributions.totalLastYear} public contributions in the last 12 months`
                          : "Contribution calendar unavailable"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span>Less</span>
                    {([0, 1, 2, 3, 4] as const).map((lvl) => (
                      <span
                        key={lvl}
                        className={`h-2.5 w-2.5 rounded-[2px] ${LEVEL_CLASSES[lvl]}`}
                      />
                    ))}
                    <span>More</span>
                  </div>
                </div>

                {weeks.length > 0 ? (
                  <div className="mt-6 overflow-x-auto pb-1">
                    <div className="inline-flex gap-[3px]">
                      {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-[3px]">
                          {week.map((day) => (
                            <button
                              key={day.date}
                              type="button"
                              onMouseEnter={() => setHoveredDay(day)}
                              onFocus={() => setHoveredDay(day)}
                              aria-label={`${day.date}: ${day.count} contributions`}
                              className={`h-2.5 w-2.5 rounded-[2px] transition-transform hover:scale-125 ${LEVEL_CLASSES[day.level]}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 text-xs font-light text-muted-foreground">
                    Contribution heatmap data could not be loaded right now.
                  </p>
                )}
              </div>
            </div>

            {/* Featured Public Repositories */}
            <div data-github-reveal className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel group flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-silver/60"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="truncate text-base font-medium text-foreground group-hover:text-silver">
                        {repo.name}
                      </h3>
                      <ArrowUpRight
                        size={16}
                        weight="light"
                        className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                      />
                    </div>
                    <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed font-light text-text-secondary">
                      {repo.description ?? "Public repository on GitHub."}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3.5 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 text-silver">
                      <span className="h-2 w-2 rounded-full bg-silver/80" />
                      {repo.language ?? "Repository"}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} weight="light" />
                        {repo.stars}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork size={12} weight="light" />
                        {repo.forks}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}