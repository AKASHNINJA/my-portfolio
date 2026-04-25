/**
 * Central place to edit your portfolio content.
 * Update the values below and the site will reflect them everywhere.
 */

export const profile = {
  name: "Akash",
  title: "Full-Stack Developer & Builder",
  tagline:
    "I design and ship delightful products at the intersection of AI, web, and great UX.",
  location: "India",
  email: "hello@example.com",
  resumeUrl: "/resume.pdf",
  socials: {
    github: "https://github.com/your-handle",
    linkedin: "https://linkedin.com/in/your-handle",
    twitter: "https://x.com/your-handle"
  }
};

export const about = {
  paragraphs: [
    "I'm a developer who loves turning fuzzy ideas into shipping software. Over the last few years I've built web apps, AI-powered tools, and developer experiences that people actually use.",
    "I care a lot about craft — performant code, clean interfaces, and thoughtful product decisions. When I'm not coding, you'll find me exploring new tech, reading, or building side projects."
  ],
  highlights: [
    "5+ years building production web applications",
    "Comfortable across the stack: Next.js, Node, Python, Postgres",
    "Shipped AI-driven features used by thousands of users",
    "Open-source contributor"
  ]
};

export type Skill = { name: string; category: "Frontend" | "Backend" | "AI/ML" | "Tools" };

export const skills: Skill[] = [
  { name: "TypeScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "PostgreSQL", category: "Backend" },
  { name: "REST & GraphQL", category: "Backend" },
  { name: "OpenAI / LLMs", category: "AI/ML" },
  { name: "LangChain", category: "AI/ML" },
  { name: "Vector DBs", category: "AI/ML" },
  { name: "Git / GitHub", category: "Tools" },
  { name: "Docker", category: "Tools" },
  { name: "Vercel / AWS", category: "Tools" }
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Agentic To-Do",
    description:
      "An AI-native task manager where an agent breaks down goals, schedules them, and follows up automatically.",
    tags: ["Next.js", "OpenAI", "Postgres"],
    repoUrl: "https://github.com/your-handle/agentic-to-do-app",
    featured: true
  },
  {
    title: "Tracker Agents",
    description:
      "A multi-agent system that monitors workflows, surfaces blockers, and writes daily standup summaries.",
    tags: ["TypeScript", "LangChain", "Slack API"],
    repoUrl: "https://github.com/your-handle/tracker-agents",
    featured: true
  },
  {
    title: "Portfolio v2",
    description:
      "This very site — built with Next.js 14 App Router, Tailwind, and Framer Motion.",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    repoUrl: "https://github.com/your-handle/my-portfolio"
  }
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    role: "Senior Software Engineer",
    company: "Your Company",
    period: "2023 — Present",
    bullets: [
      "Led a team of 4 to ship the v2 platform, growing weekly active users 3x.",
      "Designed and built an LLM-powered assistant adopted by 60% of customers.",
      "Mentored juniors, established code review and testing standards."
    ]
  },
  {
    role: "Software Engineer",
    company: "Previous Co.",
    period: "2021 — 2023",
    bullets: [
      "Owned end-to-end delivery of the analytics dashboard used by 10k+ users.",
      "Cut p95 API latency by 65% through query and caching improvements."
    ]
  }
];
