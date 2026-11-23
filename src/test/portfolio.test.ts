import { describe, expect, it } from "vitest";
import { contactFormSchema } from "@/lib/contact-schema";
import {
  CERTIFICATES,
  HACKERRANK_SKILL_BADGE,
  PROJECTS,
  SKILL_GROUPS,
  filterCertificatesByCategory,
} from "@/data/portfolio";

describe("contact form validation", () => {
  it("accepts a valid name, email, and message", () => {
    const res = contactFormSchema.safeParse({
      name: "Dhanush Shetty",
      email: "dhanushshettyd2007@gmail.com",
      message: "Interested in collaborating on an AI and IoT hackathon project.",
    });
    expect(res.success).toBe(true);
  });

  it("rejects blank or malformed inputs", () => {
    expect(
      contactFormSchema.safeParse({ name: " ", email: "not-an-email", message: "hi" }).success,
    ).toBe(false);
  });
});

describe("portfolio domain rules", () => {
  it("filters the 8 certificates cleanly across categories", () => {
    expect(filterCertificatesByCategory(CERTIFICATES, "All")).toHaveLength(8);
    expect(filterCertificatesByCategory(CERTIFICATES, "Programming")).toHaveLength(2);
    expect(filterCertificatesByCategory(CERTIFICATES, "AI & Technology")).toHaveLength(3);
    expect(filterCertificatesByCategory(CERTIFICATES, "Events")).toHaveLength(3);
  });

  it("keeps HackerRank Java 5-Star distinct as a skill badge, not in course certificates", () => {
    expect(HACKERRANK_SKILL_BADGE.classification).toBe("Skill Badge");
    expect(HACKERRANK_SKILL_BADGE.stars).toBe(5);
    expect(CERTIFICATES.some((c) => c.title.includes("Java 5-Star"))).toBe(false);
  });

  it("separates active skills from currently exploring topics", () => {
    const exploring = SKILL_GROUPS.find((g) => g.status === "Exploring");
    expect(exploring?.items).toEqual([
      "Artificial Intelligence",
      "Machine Learning",
      "Cybersecurity",
      "Embedded Systems",
      "IoT",
    ]);
  });

  it("exposes verified links without fabricating a live demo URL for SwasthElder", () => {
    const solar = PROJECTS.find((p) => p.id === "solarsync");
    const swasth = PROJECTS.find((p) => p.id === "swasthelder");
    expect(solar?.liveUrl).toBe("https://spark-solar-sync.lovable.app");
    expect(solar?.githubUrl).toBe("https://github.com/dhanushshettyd/SolarSync");
    expect(swasth?.liveUrl).toBeUndefined();
    expect(swasth?.githubUrl).toBe("https://github.com/dhanushshettyd/swasthelder-v1.1");
  });
});