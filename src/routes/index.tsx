import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { NAV_ITEMS, PORTFOLIO_CONFIG } from "@/data/portfolio";
import { Preloader } from "@/components/portfolio/Preloader";
import { Navbar } from "@/components/portfolio/Navbar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { AchievementsSection } from "@/components/portfolio/AchievementsSection";
import { CertificationsSection } from "@/components/portfolio/CertificationsSection";
import { GithubSection } from "@/components/portfolio/GithubSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DHANUSH SHETTY. D — Developer, Engineer & Problem Solver" },
      {
        name: "description",
        content:
          "Portfolio of Dhanush Shetty. D — Computer & Communication Engineering student at KS Institute of Technology, Bengaluru. Projects, hackathon merit award, certifications, and GitHub activity.",
      },
      { property: "og:title", content: "DHANUSH SHETTY. D — Developer Portfolio" },
      {
        property: "og:description",
        content:
          "Building Ideas Into Reality. Explore SolarSync, SwasthElder, hackathon awards, certifications, and live GitHub activity.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Dhanush Shetty. D",
          jobTitle: "Computer and Communication Engineering Student & Developer",
          sameAs: [PORTFOLIO_CONFIG.githubUrl, PORTFOLIO_CONFIG.linkedinUrl].filter(Boolean),
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const lenisRef = useRef<Lenis | null>(null);

  const handlePreloaderComplete = useCallback(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ids = NAV_ITEMS.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navigateToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -20 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(sectionId);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Preloader onComplete={handlePreloaderComplete} />
      <Navbar activeSection={activeSection} onNavigate={navigateToSection} />
      <main>
        <HeroSection ready={ready} onNavigate={navigateToSection} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <AchievementsSection onNavigate={navigateToSection} />
        <CertificationsSection />
        <GithubSection />
        <ContactSection />
      </main>
      <Footer onNavigate={navigateToSection} />
    </div>
  );
}
