import { createServerFn } from "@tanstack/react-start";
import { contactFormSchema } from "@/lib/contact-schema";
import { PORTFOLIO_CONFIG } from "@/data/portfolio";

export interface GithubRepoDTO {
  id: number;
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
}

export interface GithubContributionDayDTO {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GithubPortfolioDTO {
  ok: boolean;
  error: string | null;
  profile: {
    login: string;
    name: string | null;
    avatarUrl: string;
    htmlUrl: string;
    bio: string | null;
    publicRepos: number;
    followers: number;
    following: number;
  } | null;
  repos: GithubRepoDTO[];
  contributions: {
    totalLastYear: number;
    days: GithubContributionDayDTO[];
  } | null;
}

export const getGithubPortfolio = createServerFn({ method: "GET" }).handler(
  async (): Promise<GithubPortfolioDTO> => {
    const username = PORTFOLIO_CONFIG.githubUsername;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "dhanush-shetty-portfolio",
    };
    // Optional: unauthenticated GitHub API calls from shared server IPs often hit rate limits (HTTP 403).
    // A token with no scopes (read-only public data) lifts the limit.
    const githubToken = process.env["GITHUB_TOKEN"];
    if (githubToken) headers["Authorization"] = `Bearer ${githubToken}`;

    try {
      const [userRes, reposRes, contribRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers }),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
          headers,
        }),
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`).catch(
          () => null,
        ),
      ]);

      if (!userRes.ok) {
        return {
          ok: false,
          error: `GitHub API returned status ${userRes.status}. Live statistics could not be retrieved right now.`,
          profile: null,
          repos: [],
          contributions: null,
        };
      }

      const userJson = (await userRes.json()) as {
        login: string;
        name: string | null;
        avatar_url: string;
        html_url: string;
        bio: string | null;
        public_repos: number;
        followers: number;
        following: number;
      };

      const reposJson = reposRes.ok
        ? ((await reposRes.json()) as Array<{
            id: number;
            name: string;
            description: string | null;
            html_url: string;
            language: string | null;
            stargazers_count: number;
            forks_count: number;
            updated_at: string;
          }>)
        : [];

      let contributions: GithubPortfolioDTO["contributions"] = null;
      if (contribRes && contribRes.ok) {
        const cJson = (await contribRes.json()) as {
          total?: { lastYear?: number };
          contributions?: Array<{ date: string; count: number; level: number }>;
        };
        if (Array.isArray(cJson.contributions)) {
          contributions = {
            totalLastYear: cJson.total?.lastYear ?? 0,
            days: cJson.contributions.map((d) => ({
              date: d.date,
              count: d.count,
              level: Math.max(0, Math.min(4, d.level)) as 0 | 1 | 2 | 3 | 4,
            })),
          };
        }
      }

      return {
        ok: true,
        error: null,
        profile: {
          login: userJson.login,
          name: userJson.name,
          avatarUrl: userJson.avatar_url,
          htmlUrl: userJson.html_url,
          bio: userJson.bio,
          publicRepos: userJson.public_repos,
          followers: userJson.followers,
          following: userJson.following,
        },
        repos: reposJson.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          htmlUrl: r.html_url,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          updatedAt: r.updated_at,
        })),
        contributions,
      };
    } catch {
      return {
        ok: false,
        error: "Unable to reach GitHub right now. Please try again shortly.",
        profile: null,
        repos: [],
        contributions: null,
      };
    }
  },
);

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactFormSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: true; id: string } | { ok: false; error: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: inserted, error } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        message: data.message,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      console.error("[contact_submissions] Insert failed:", error?.message ?? "Unknown error");
      return {
        ok: false,
        error: "Your message could not be saved right now. Please try again in a moment.",
      };
    }

    return { ok: true, id: inserted.id };
  });