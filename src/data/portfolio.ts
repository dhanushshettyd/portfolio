export type CertificateCategory = "All" | "Programming" | "AI & Technology" | "Events";

export interface PortfolioProfileConfig {
  brandName: string;
  monogram: string;
  tagline: string;
  githubUsername: string;
  githubUrl: string;
  linkedinUrl: string | null;
  linkedinPlaceholder: string;
  email: string | null;
  emailPlaceholder: string;
  resumeUrl: string | null;
  splineSceneUrl: string;
  profileImageUrl: string;
}

export const PORTFOLIO_CONFIG: PortfolioProfileConfig = {
  brandName: "DHANUSH SHETTY. D",
  monogram: "DS",
  tagline: "Building Ideas Into Reality.",
  githubUsername: "dhanushshettyd",
  githubUrl: "https://github.com/dhanushshettyd",
  linkedinUrl: "https://www.linkedin.com/in/dhanush-shetty-d/",
  linkedinPlaceholder: "https://www.linkedin.com/in/dhanush-shetty-d/",
  email: "dhanushshettyd2007@gmail.com",
  emailPlaceholder: "dhanushshettyd2007@gmail.com",
  resumeUrl: "/Dhanush-Shetty-D-Resume.pdf",
  splineSceneUrl: "https://my.spline.design/blackhole-oyVYmLM847sbmF5w5ZL7AUhc/",
  profileImageUrl: "/images/profile.jpeg",
};

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;

export const FOOTER_NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export const ABOUT_INFO_CARDS = [
  { label: "Education", value: "Computer and Communication Engineering", icon: "graduation" },
  { label: "Institution", value: "KS Institute of Technology", icon: "buildings" },
  { label: "Location", value: "Bengaluru, India", icon: "mapPin" },
  { label: "Interests", value: "Development, AI, Cybersecurity, Embedded Systems", icon: "compass" },
] as const;

export interface SkillGroup {
  id: string;
  title: string;
  status: "Active" | "Exploring";
  subtitle: string;
  items: readonly string[];
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: "languages",
    title: "Programming Languages",
    status: "Active",
    subtitle: "Core languages used across coursework and projects",
    items: ["C", "C++", "Python", "Java", "JavaScript"],
  },
  {
    id: "web",
    title: "Web Development",
    status: "Active",
    subtitle: "Building responsive interfaces and interactive web applications",
    items: ["HTML", "CSS", "JavaScript", "React", "Responsive Web Design"],
  },
  {
    id: "tools",
    title: "Tools & Technologies",
    status: "Active",
    subtitle: "Daily engineering, prototyping, and version-control environment",
    items: ["Git", "GitHub", "Arduino", "VS Code", "Linux / Unix"],
  },
  {
    id: "exploring",
    title: "Currently Exploring",
    status: "Exploring",
    subtitle: "Domains I am actively studying, experimenting with, and learning",
    items: [
      "Artificial Intelligence",
      "Machine Learning",
      "Cybersecurity",
      "Embedded Systems",
      "IoT",
    ],
  },
];

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  features: readonly string[];
  achievement?: string;
  technologies: readonly string[];
  liveUrl?: string;
  githubUrl: string;
  imageSlotLabel: string;
  imageUrl: string;
}

export const PROJECTS: readonly ProjectItem[] = [
  {
    id: "solarsync",
    number: "01",
    title: "SolarSync",
    category: "Renewable Energy | AI | Smart Campus",
    description:
      "An integrated renewable energy concept combining photovoltaic solar energy with geothermal cooling technology to improve campus energy efficiency, reduce electricity consumption and support sustainable energy management.",
    features: [
      "Solar energy generation",
      "Geothermal cooling integration",
      "Smart energy management",
      "Battery storage concept",
      "AI-assisted energy prediction and optimization",
    ],
    achievement: "MERIT WINNERS — ALLIANCE ONE YUKTHI 2026",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "JavaScript"],
    liveUrl: "https://projectsolarsync.netlify.app/",
    githubUrl: "https://github.com/dhanushshettyd/SolarSync",
    imageSlotLabel: "project-1 (SolarSync preview)",
    imageUrl: "/images/project-2.png",
  },
  {
    id: "swasthelder",
    number: "02",
    title: "SwasthElder",
    category: "Healthcare | AI | Web Development",
    description:
      "A digital elderly-care management platform designed to help old-age homes manage medication information and improve accessibility to healthcare-related support through an AI-assisted symptom-based tablet suggestion feature.",
    features: [
      "Elderly-care management interface",
      "Medication management",
      "AI-assisted symptom-based suggestions",
      "User-friendly interface",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "JavaScript"],
    liveUrl: "https://swasthelder.netlify.app/",
    githubUrl: "https://github.com/dhanushshettyd/swasthelder-v1.1",
    imageSlotLabel: "project-2 (SwasthElder preview)",
    imageUrl: "/images/project-1.png",
  },
];

export const FEATURED_ACHIEVEMENT = {
  event: "ALLIANCE ONE YUKTHI 2026",
  award: "MERIT WINNERS PRIZE",
  tier: "Winning Award",
  project: "SolarSync",
  recognition: "Geothermal Cooling Technology integrated with PV Solar Energy",
  format: "24-hour national-level hackathon",
  organizer: "Alliance University, Bengaluru",
  date: "October 2026",
  certificateId: "alliance-one-yukthi-2026",
} as const;

export const OTHER_ACHIEVEMENTS = [
  {
    number: "01",
    title: "NEXORA TECHSPRINT 2K26",
    tier: "Certificate of Appreciation",
    organizer: "S-VYASA Deemed to be University",
    date: "November 4–5, 2026",
  },
  {
    number: "02",
    title: "CODEKALA 3.0",
    tier: "Certificate of Participation",
    organizer: "KS Institute of Technology",
    date: "Technical Event Participation",
  },
  {
    number: "03",
    title: "INVENTRA '26 — PathPulse",
    tier: "Certificate of Participation",
    organizer: "Sri Krishna Institute of Technology",
    date: "November 21, 2026",
  },
] as const;

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  type: string;
  date: string;
  category: Exclude<CertificateCategory, "All">;
}

export const CERTIFICATES: readonly CertificateItem[] = [
  {
    id: "ai-skills-passport",
    title: "AI Skills Passport",
    issuer: "EY and Microsoft",
    type: "Certificate of Completion",
    date: "Completed",
    category: "AI & Technology",
  },
  {
    id: "c-programming-infosys",
    title: "C Programming Course",
    issuer: "Infosys",
    type: "Certificate of Completion",
    date: "June 5, 2026",
    category: "Programming",
  },
  {
    id: "csharp-basic-hackerrank",
    title: "C# (Basic)",
    issuer: "HackerRank",
    type: "Skill Certification",
    date: "November 10, 2026",
    category: "Programming",
  },
  {
    id: "intro-unix-infosys",
    title: "Introduction to Unix",
    issuer: "Infosys",
    type: "Certificate of Completion",
    date: "October 25, 2026",
    category: "AI & Technology",
  },
  {
    id: "intro-iot-skill-india",
    title: "Introduction to IoT",
    issuer: "Skill India / Telecom Sector Skill Council",
    type: "Certificate of Completion",
    date: "June 24, 2026",
    category: "AI & Technology",
  },
  {
    id: "codekala-3",
    title: "CODEKALA 3.0",
    issuer: "KS Institute of Technology",
    type: "Certificate of Participation",
    date: "Event Participation",
    category: "Events",
  },
  {
    id: "inventra-26-pathpulse",
    title: "INVENTRA '26 — PathPulse",
    issuer: "Sri Krishna Institute of Technology",
    type: "Certificate of Participation",
    date: "November 21, 2026",
    category: "Events",
  },
  {
    id: "nexora-techsprint-2k26",
    title: "NEXORA TECHSPRINT 2K26",
    issuer: "S-VYASA",
    type: "Certificate of Appreciation",
    date: "November 4–5, 2026",
    category: "Events",
  },
];

export const HACKERRANK_SKILL_BADGE = {
  title: "Java 5-Star Skill Badge",
  issuer: "HackerRank",
  classification: "Skill Badge",
  stars: 5,
  note: "Recognizes sustained Java problem-solving proficiency on HackerRank — displayed as a skill badge distinct from standalone course certificates.",
} as const;

export function filterCertificatesByCategory(
  certificates: readonly CertificateItem[],
  category: CertificateCategory,
): readonly CertificateItem[] {
  if (category === "All") return certificates;
  return certificates.filter((item) => item.category === category);
}