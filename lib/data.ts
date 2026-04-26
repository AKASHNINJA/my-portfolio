/**
 * Central place to edit your portfolio content.
 * Update the values below and the site will reflect them everywhere.
 */

export const profile = {
  name: "Akash Premkumar",
  title: "Implementation Consultant & Product-minded Builder",
  tagline:
    "I turn customer pain points into shipped product outcomes — bridging implementation, AI tooling, and product strategy in SaaS and fintech.",
  location: "Chennai, India",
  email: "akashninja1123@gmail.com",
  phone: "+91 7358 200 179",
  resumeUrl: "/resume.pdf",
  socials: {
    github: "https://github.com/AKASHNINJA",
    linkedin: "https://www.linkedin.com/in/akash-premkumar-a95a42161/"
  }
};

export const about = {
  paragraphs: [
    "I'm an Implementation Consultant at Chargebee with 3 years of experience helping SaaS and fintech companies go live successfully. I've delivered 50+ customer projects end-to-end — owning configurations, integrations, and data migrations — and I love sitting at the seam between customers, product, and engineering.",
    "I care about turning fuzzy customer pain into crisp product outcomes. That's led me to build internal AI tools like a Revenue Recognition Simulator and a Language Pack Translator, and to push 15+ customer-driven insights into the product roadmap. Outside delivery, I document, train, and lift the team's bar."
  ],
  highlights: [
    "3 years in product implementation across SaaS & fintech",
    "Delivered 50+ customer projects with 100% successful go-lives",
    "Built AI tools that cut onboarding setup time by 40%",
    "Translated 15+ customer pain points into roadmap items",
    "Department Gold Medalist, B.E. EEE, SSN College of Engineering (CGPA 9.6)"
  ]
};

export type Skill = {
  name: string;
  category: "Product & Implementation" | "Tools & Platforms" | "Domain" | "AI & Automation";
};

export const skills: Skill[] = [
  { name: "Customer Onboarding", category: "Product & Implementation" },
  { name: "Requirements Gathering", category: "Product & Implementation" },
  { name: "Solution Design", category: "Product & Implementation" },
  { name: "Integrations", category: "Product & Implementation" },
  { name: "Data Migration", category: "Product & Implementation" },
  { name: "Stakeholder Management", category: "Product & Implementation" },

  { name: "Chargebee", category: "Tools & Platforms" },
  { name: "Everstage", category: "Tools & Platforms" },
  { name: "SQL", category: "Tools & Platforms" },
  { name: "Postman / REST APIs", category: "Tools & Platforms" },
  { name: "Jira / Notion", category: "Tools & Platforms" },

  { name: "SaaS", category: "Domain" },
  { name: "Fintech", category: "Domain" },
  { name: "Subscription Billing", category: "Domain" },
  { name: "Revenue Recognition", category: "Domain" },
  { name: "Sales Compensation", category: "Domain" },

  { name: "AI Tooling", category: "AI & Automation" },
  { name: "Prompt Engineering", category: "AI & Automation" },
  { name: "Workflow Automation", category: "AI & Automation" }
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
    title: "Revenue Recognition Simulator",
    description:
      "Internal AI tool that automates revenue recognition scenario testing for global merchants, reducing manual setup time by 40% during onboarding.",
    tags: ["AI", "Revenue Recognition", "SaaS Onboarding"],
    featured: true
  },
  {
    title: "Language Pack Translator",
    description:
      "AI-powered translation tool that streamlines multilingual onboarding for global merchants, accelerating localization and time-to-go-live.",
    tags: ["AI", "Localization", "Onboarding"],
    featured: true
  },
  {
    title: "Implementation Playbooks",
    description:
      "Documented best practices and reusable playbooks across SaaS and fintech implementations, training cross-functional teams and lifting team productivity by 30%.",
    tags: ["Documentation", "Enablement", "Process"]
  }
  // TODO: add personal/side projects (e.g. Agentic To-Do, Tracker Agents) with real repo URLs.
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    role: "Implementation Consultant",
    company: "Chargebee",
    period: "Sep 2024 — Present",
    bullets: [
      "Implemented SMB and Enterprise customer projects across SaaS, e-commerce, and fintech domains by managing configurations, integrations, and data migrations end-to-end — resulting in successful go-lives and accelerating customers' revenue realization.",
      "Developed internal enablement tools including the RevRec Simulator (automating revenue recognition scenarios) and Language Pack Translator (streamlining multilingual onboarding), reducing setup time by 35% and improving onboarding efficiency.",
      "Partnered with Product and Engineering teams to introduce AI-driven automation and product enhancements, eliminating 40% of manual configuration effort and improving implementation turnaround time from weeks to days.",
      "Advocated customer needs during onboarding, translating pain points into actionable product insights adopted into the roadmap — enhancing product usability and increasing customer satisfaction scores."
    ]
  },
  {
    role: "Solution Specialist",
    company: "Everstage",
    period: "Jan 2023 — Sep 2024",
    bullets: [
      "Successfully onboarded multiple SMB and Enterprise customers, facilitating seamless transitions and fostering strong client relationships.",
      "Served as the primary point of contact for clients throughout the engagement process, addressing concerns, providing updates, and ensuring client satisfaction.",
      "Collaborated closely with Technical teams to understand client requirements and support the sales process.",
      "Worked on CRMs including Salesforce (SFDC), NetSuite, and HubSpot to configure and tailor implementations to each client's business workflows."
    ]
  }
];

export type EducationEntry = {
  school: string;
  qualification: string;
  period: string;
  details: string[];
};

export const education: EducationEntry[] = [
  {
    school: "SSN College of Engineering, Chennai",
    qualification: "B.E. — Electrical and Electronics Engineering",
    period: "2019 — 2023",
    details: ["CGPA: 9.6 / 10", "Department Gold Medalist"]
  },
  {
    school: "The Hindu Colony Chellammal Vidyalaya Sr. Sec. School",
    qualification: "Higher Secondary (Class 12)",
    period: "2018 — 2019",
    details: ["Scored 474 / 500", "Silver Medalist"]
  }
];

export type Achievement = {
  title: string;
  description: string;
};

export const achievements: Achievement[] = [
  {
    title: "Merit Scholarship",
    description:
      "Awarded the Merit Scholarship for four consecutive years at SSN College of Engineering for outstanding academic performance (CGPA 9.61/10)."
  },
  {
    title: "Best Paper Award",
    description:
      "Won Best Paper Award at the International Conference on Material and Energy Technologies for research on Synchronous Motors, later published in a Springer Journal."
  },
  {
    title: "IEEE Member",
    description:
      "Active IEEE Member contributing to technical webinars, workshops, and student-led innovation initiatives at SSN College of Engineering."
  }
];
