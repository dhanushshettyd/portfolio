import { useEffect, useState } from "react";
import {
  DownloadSimple,
  GithubLogo,
  LinkedinLogo,
  List,
  X,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { NAV_ITEMS, PORTFOLIO_CONFIG } from "@/data/portfolio";

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  const handleLinkedInClick = () => {
    if (PORTFOLIO_CONFIG.linkedinUrl) {
      window.open(PORTFOLIO_CONFIG.linkedinUrl, "_blank", "noopener,noreferrer");
      return;
    }
    toast("LinkedIn profile link is a placeholder", {
      description: "Share your LinkedIn URL to activate this link.",
    });
  };

  const handleResumeClick = () => {
    if (PORTFOLIO_CONFIG.resumeUrl) {
      const link = document.createElement("a");
      link.href = PORTFOLIO_CONFIG.resumeUrl;
      link.download = "Dhanush-Shetty-D-Resume.pdf";
      link.click();
      return;
    }
    toast("Resume PDF not uploaded yet", {
      description: "Upload your resume PDF anytime to enable direct download.",
    });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Primary navigation"
            className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-300 ${
              scrolled ? "glass-nav silver-glow" : "border border-transparent bg-transparent"
            }`}
          >
            <button
              type="button"
              onClick={() => handleLinkClick("home")}
              className="text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              DS<span className="text-silver">.</span>
            </button>

            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleLinkClick(item.id)}
                      className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors ${
                        isActive
                          ? "bg-foreground/10 text-foreground"
                          : "text-text-secondary hover:text-foreground"
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute inset-x-4 -bottom-0.5 h-px bg-silver" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="hidden items-center gap-2 lg:flex">
              <a
                href={PORTFOLIO_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-secondary/70 text-text-secondary transition-all hover:border-silver/60 hover:text-foreground"
              >
                <GithubLogo size={17} weight="light" />
              </a>
              <button
                type="button"
                onClick={handleLinkedInClick}
                aria-label="LinkedIn profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-secondary/70 text-text-secondary transition-all hover:border-silver/60 hover:text-foreground"
              >
                <LinkedinLogo size={17} weight="light" />
              </button>
              <button
                type="button"
                onClick={handleResumeClick}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-silver/40 bg-foreground px-4 text-xs font-medium text-primary-foreground transition-all hover:scale-[1.02] hover:bg-silver"
              >
                <DownloadSimple size={15} weight="light" />
                Resume
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-secondary/80 text-foreground lg:hidden"
            >
              {mobileOpen ? <X size={20} weight="light" /> : <List size={20} weight="light" />}
            </button>
          </nav>
        </div>
      </header>

      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-30 flex flex-col justify-between bg-background px-6 pt-28 pb-10 transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className={`flex items-baseline justify-between border-b border-border/60 py-3.5 text-left transition-colors ${
                  isActive ? "text-foreground" : "text-text-secondary hover:text-foreground"
                }`}
              >
                <span className="text-2xl font-medium tracking-tight">{item.label}</span>
                <span className="text-xs tracking-widest text-muted-foreground">
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-3 pt-6">
          <a
            href={PORTFOLIO_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground"
          >
            <GithubLogo size={16} weight="light" />
            GitHub
          </a>
          <button
            type="button"
            onClick={handleLinkedInClick}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground"
          >
            <LinkedinLogo size={16} weight="light" />
            LinkedIn
          </button>
          <button
            type="button"
            onClick={handleResumeClick}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-medium text-primary-foreground"
          >
            <DownloadSimple size={16} weight="light" />
            Resume
          </button>
        </div>
      </div>
    </>
  );
}