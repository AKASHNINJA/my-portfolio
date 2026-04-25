# my-portfolio

A modern, fast, fully-typed personal portfolio built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Includes dark mode, smooth scroll, animated sections, and a single source of truth for content.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router, React Server Components)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for subtle animations
- [Lucide](https://lucide.dev/) icons

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

## Customizing your portfolio

All content lives in **one file** so you can make it yours in minutes:

- `lib/data.ts` — your name, tagline, socials, about text, skills, projects, and experience.
- `app/layout.tsx` — site-wide metadata (uses values from `lib/data.ts`).
- `tailwind.config.ts` — colors, fonts, animations.
- `app/globals.css` — base styles and reusable utility classes (`.card`, `.btn-primary`, etc.).

### Add a project

Open `lib/data.ts` and append to the `projects` array:

```ts
{
  title: "My new project",
  description: "What it does in one sentence.",
  tags: ["Next.js", "Postgres"],
  liveUrl: "https://example.com",
  repoUrl: "https://github.com/your-handle/my-new-project",
  featured: true
}
```

### Add your resume

Drop a PDF named `resume.pdf` into the `public/` folder. The hero/contact buttons will automatically link to `/resume.pdf` (configured in `lib/data.ts`).

## Project structure

```
my-portfolio/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Experience.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Projects.tsx
│   └── Skills.tsx
├── lib/
│   └── data.ts        ← edit me to personalize
├── public/
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Deploy

The easiest path is [Vercel](https://vercel.com/new):

1. Push this repo to GitHub.
2. Import it in Vercel and accept defaults.
3. Done — every push to `main` deploys automatically.

You can also deploy to Netlify, Cloudflare Pages, or run `npm run build && npm start` on any Node host.

## License

MIT — make it yours.
