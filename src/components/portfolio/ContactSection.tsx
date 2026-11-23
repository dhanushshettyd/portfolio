import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Check,
  Copy,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  PaperPlaneTilt,
  SpinnerGap,
  WarningCircle,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { PORTFOLIO_CONFIG } from "@/data/portfolio";
import { contactFormSchema } from "@/lib/contact-schema";

const FORMSPREE_URL = "https://formspree.io/f/mvkavknd";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<
    { kind: "idle" } | { kind: "success" } | { kind: "error"; text: string }
  >({ kind: "idle" });
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-contact-reveal]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState({ kind: "idle" });

    const parsed = contactFormSchema.safeParse({ name, email, message });
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "name" || key === "email" || key === "message") {
          fieldErrors[key] ??= issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          message: parsed.data.message,
        }),
      });

      if (res.ok) {
        setSubmitState({ kind: "success" });
        setName("");
        setEmail("");
        setMessage("");
        toast.success("Message sent", {
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
      } else {
        const text = "Could not send your message. Please try again.";
        setSubmitState({ kind: "error", text });
        toast.error("Could not send message", { description: text });
      }
    } catch {
      const msg = "Something went wrong while submitting your message. Please try again.";
      setSubmitState({ kind: "error", text: msg });
      toast.error("Submission failed", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyEmail = async () => {
    if (!PORTFOLIO_CONFIG.email) return;
    try {
      await navigator.clipboard.writeText(PORTFOLIO_CONFIG.email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard");
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      toast("Copy unavailable", { description: PORTFOLIO_CONFIG.email });
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative bg-surface-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-contact-reveal className="lg:col-span-5">
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
              07 / Contact
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
              Have an Idea? Let&apos;s Build It.
            </h2>
            <p className="mt-5 text-base leading-relaxed font-light text-text-secondary">
              I&apos;m always interested in connecting with people, exploring new ideas and
              building meaningful technology solutions.
            </p>

            <div className="mt-10 space-y-3.5">
              <div className="glass-panel flex items-center justify-between gap-3 rounded-2xl p-4">
                <a
                  href={`mailto:${PORTFOLIO_CONFIG.email ?? ""}`}
                  className="flex min-w-0 items-center gap-3.5 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-elevated text-silver">
                    <EnvelopeSimple size={18} weight="light" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      Email
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      {PORTFOLIO_CONFIG.email ?? PORTFOLIO_CONFIG.emailPlaceholder}
                    </p>
                  </div>
                </a>
                {PORTFOLIO_CONFIG.email && (
                  <button
                    type="button"
                    onClick={() => void handleCopyEmail()}
                    aria-label="Copy email address"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-silver transition-colors hover:border-silver hover:text-foreground"
                  >
                    {copiedEmail ? <Check size={15} weight="light" /> : <Copy size={15} weight="light" />}
                  </button>
                )}
              </div>

              <a
                href={PORTFOLIO_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel group flex items-center justify-between rounded-2xl p-4 transition-colors hover:border-silver/60"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-elevated text-silver">
                    <GithubLogo size={18} weight="light" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      GitHub
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      github.com/{PORTFOLIO_CONFIG.githubUsername}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  size={17}
                  weight="light"
                  className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                />
              </a>

              <a
                href={PORTFOLIO_CONFIG.linkedinUrl ?? "#contact"}
                target={PORTFOLIO_CONFIG.linkedinUrl ? "_blank" : undefined}
                rel={PORTFOLIO_CONFIG.linkedinUrl ? "noopener noreferrer" : undefined}
                className="glass-panel group flex items-center justify-between rounded-2xl p-4 transition-colors hover:border-silver/60"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-elevated text-silver">
                    <LinkedinLogo size={18} weight="light" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      LinkedIn
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      linkedin.com/in/dhanush-shetty-d
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  size={17}
                  weight="light"
                  className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                />
              </a>
            </div>
          </div>

          <div data-contact-reveal className="lg:col-span-7">
            <form
              onSubmit={(e) => void handleSubmit(e)}
              noValidate
              className="glass-panel rounded-3xl p-7 sm:p-10"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium uppercase tracking-[0.18em] text-silver"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    aria-invalid={Boolean(errors.name)}
                    className="mt-2.5 w-full rounded-xl border border-border bg-background/85 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-silver focus:outline-none"
                  />
                  {errors.name && (
                    <p role="alert" className="mt-1.5 text-xs text-silver">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium uppercase tracking-[0.18em] text-silver"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    aria-invalid={Boolean(errors.email)}
                    className="mt-2.5 w-full rounded-xl border border-border bg-background/85 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-silver focus:outline-none"
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1.5 text-xs text-silver">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-silver"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your idea, project, or collaboration..."
                  aria-invalid={Boolean(errors.message)}
                  className="mt-2.5 w-full resize-y rounded-xl border border-border bg-background/85 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-silver focus:outline-none"
                />
                {errors.message && (
                  <p role="alert" className="mt-1.5 text-xs text-silver">
                    {errors.message}
                  </p>
                )}
              </div>

              {submitState.kind === "success" && (
                <div
                  role="status"
                  className="mt-6 flex items-start gap-3 rounded-2xl border border-silver/45 bg-surface-elevated/80 p-4 text-xs text-foreground"
                >
                  <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-foreground" />
                  <span>
                    Message sent successfully. Thanks for reaching out — I&apos;ll review your
                    note soon.
                  </span>
                </div>
              )}

              {submitState.kind === "error" && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-background p-4 text-xs text-silver"
                >
                  <WarningCircle size={16} weight="light" className="mt-0.5 shrink-0" />
                  <span>{submitState.text}</span>
                </div>
              )}

              <div className="mt-8 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] hover:bg-silver disabled:pointer-events-none disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <SpinnerGap size={17} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <PaperPlaneTilt size={16} weight="light" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}