# Akash Premkumar — 3D Interactive Portfolio

An explorable 3D city/farm built in the browser, where each milestone zone reveals a piece of my story — about, education, achievements, work, skills, and contact. Walk around with WASD/arrow keys and let the world unfold one zone at a time.

> Built with **Next.js 14**, **React Three Fiber**, **Three.js**, **Zustand**, **Tailwind CSS**, and **Framer Motion**.

![Start screen](public/preview-start.png)
![Roaming](public/preview-running.png)

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) | File-based routing, RSC + client islands, easy Vercel deploys |
| Language | [TypeScript](https://www.typescriptlang.org/) 5.5 | End-to-end type safety across the game store, scene, and content |
| 3D engine | [Three.js](https://threejs.org/) `^0.167` | Battle-tested WebGL renderer |
| 3D React layer | [`@react-three/fiber`](https://docs.pmnd.rs/react-three-fiber) | Declaratively describe a Three.js scene as React components |
| 3D helpers | [`@react-three/drei`](https://github.com/pmndrs/drei) | `<Sky>`, cameras, and other batteries-included helpers |
| State | [Zustand](https://zustand-demo.pmnd.rs/) `^5` | Tiny, hookable game store — phase, player position, milestones |
| Styling | [Tailwind CSS](https://tailwindcss.com/) `3.4` | Fast utility-first styling for the 2D HUD and overlays |
| 2D animation | [Framer Motion](https://www.framer.com/motion/) | Smooth transitions on the start screen and milestone cards |
| Icons | [Lucide](https://lucide.dev/) | Lightweight icon set for HUD and overlays |
| Tooling | ESLint, PostCSS, Autoprefixer | Standard Next.js dev experience |

---

## Architecture at a glance

```
                       ┌─────────────────────────────────────┐
                       │            app/page.tsx             │
                       │  (mounts canvas + 2D HUD overlays)  │
                       └────────────────┬────────────────────┘
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            │                           │                           │
            ▼                           ▼                           ▼
   ┌────────────────┐         ┌──────────────────┐         ┌──────────────────┐
   │  GameCanvas    │         │   Controls       │         │  HUD / Overlays  │
   │ (R3F <Canvas>) │         │  (keyboard →     │         │  StartScreen     │
   │                │         │   gameStore)     │         │  MilestoneCard   │
   └────────┬───────┘         └────────┬─────────┘         │  HUD             │
            │                          │                   └────────┬─────────┘
            ▼                          │                            │
   ┌────────────────┐                  │                            │
   │     Scene      │ ───── reads ─────┴────── reads ───────────────┘
   │  (camera, sky, │                  │
   │   lighting,    │                  ▼
   │   zone trigger)│         ┌──────────────────┐
   └────────┬───────┘         │   gameStore      │  ◄─── tick(), setMove(),
            │                 │   (Zustand)      │       openMilestone(),
            ▼                 │                  │       closeMilestone()
   ┌────────────────┐         │  phase           │
   │ City / Farm /  │         │  playerX, Z, rotY│
   │ Player /       │         │  moveX, Z        │
   │ Obstacles /    │         │  activeMilestone │
   │ Gate           │         │  seenMilestones  │
   └────────────────┘         └──────────────────┘
                                       ▲
                                       │
                              ┌──────────────────┐
                              │  lib/data.ts     │  resume content
                              │  lib/gameData.ts │  milestone zones, icons
                              └──────────────────┘
```

### How a frame flows

1. **Input** — `Controls.tsx` listens for keyboard events and writes a normalised movement vector (`moveX`, `moveZ`) into the Zustand store every animation frame.
2. **Tick** — `Scene.tsx` calls `gameStore.tick(delta)` on every R3F `useFrame`, which integrates the movement vector into the player's world position with bounds clamping.
3. **Camera** — Same `useFrame` lerps the third-person camera behind/above the player and aims at a point ahead of them.
4. **Zone detection** — Scene checks the player's distance to each milestone zone in `gameData.ts`. Entering a zone the first time switches `phase: 'roaming' → 'milestone'` and sets `activeMilestone`.
5. **Render** — `MilestoneCard.tsx` (a 2D React overlay) reads `activeMilestone` from the store and shows the relevant content from `lib/data.ts`. Pressing Space/Enter dispatches `closeMilestone()` and movement resumes.
6. **Completion** — Once `seenMilestones.length === milestones.length`, the store flips to `phase: 'complete'`.

### State machine

```
              start()             enter zone           close card (more left)
   intro ───────────────► roaming ──────────► milestone ─────────────────────┐
     ▲                      ▲   │                  │                          │
     │                      │   │ close card       │                          │
     │ reset()              │   │ (all done)       │                          │
     │                      └───┴────────► complete ◄─────────────────────────┘
```

---

## Project structure

```
my-portfolio/
├── app/
│   ├── globals.css            # Tailwind + base styles
│   ├── layout.tsx             # Root layout, metadata
│   └── page.tsx               # Mounts <GameCanvas> + HUD overlays
├── components/
│   ├── game/
│   │   ├── GameCanvas.tsx     # R3F <Canvas> + error boundary
│   │   ├── Scene.tsx          # Camera, lighting, sky, zone triggers
│   │   ├── City.tsx           # Cityscape geometry
│   │   ├── Farm.tsx           # Farm scene geometry
│   │   ├── Track.tsx          # Path / ground track
│   │   ├── Player.tsx         # Avatar mesh + animation rig
│   │   ├── Obstacles.tsx      # Static obstacle props
│   │   ├── Gate.tsx           # Milestone gate visuals
│   │   ├── Controls.tsx       # Keyboard → store (movement + phase actions)
│   │   ├── HUD.tsx            # 2D HUD: minimap, hints, progress
│   │   ├── MilestoneCard.tsx  # 2D overlay shown when a zone is entered
│   │   └── StartScreen.tsx    # Intro overlay (Space to start)
│   └── (legacy 2D sections)   # About, Hero, Skills, etc. kept for reference
├── lib/
│   ├── data.ts                # Resume content: profile, about, skills,
│   │                          # projects, experience, education, achievements
│   └── gameData.ts            # Milestone zones (id, position, icon, color)
├── store/
│   └── gameStore.ts           # Zustand store: phase + player + milestones
├── public/
│   ├── preview.png            # Hero/social preview
│   ├── preview-start.png      # Start screen screenshot
│   └── preview-running.png    # In-game screenshot
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Controls

| Action | Keys |
|---|---|
| Start | `Space` (on intro screen) |
| Move | `W` `A` `S` `D` or `↑` `←` `↓` `→` |
| Close milestone card | `Space` or `Enter` |

---

## Getting started

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

---

## Customizing

### Resume content (`lib/data.ts`)

All textual portfolio content lives here in typed exports: `profile`, `about`, `skills`, `projects`, `experience`, `education`, `achievements`. Edit values and the in-game milestone cards update automatically.

### Milestone layout (`lib/gameData.ts`)

Each milestone zone is a plain object:

```ts
{
  id: 'education',
  title: 'Education',
  items: [...],
  color: '#a855f7',
  position: 2 * GATE_INTERVAL,
  zoneX: -22, zoneZ: -36, zoneRadius: 11,
  zoneIcon: '📚',
}
```

Add a new entry to `milestones[]`, give it a unique `(zoneX, zoneZ)` inside the farm bounds (`-36 ≤ X ≤ 36`, `-128 ≤ Z ≤ 5` per `store/gameStore.ts`), and the scene picks it up.

### Resume PDF

Drop `resume.pdf` into `public/` and the contact buttons will link to `/resume.pdf` (configured in `lib/data.ts → profile.resumeUrl`).

---

## Performance notes

- The R3F `<Canvas>` is dynamically imported with `ssr: false` to keep the server bundle tiny and avoid hydration mismatch.
- An `<ErrorBoundary>` wraps the canvas so a WebGL or asset failure shows a friendly fallback instead of a blank screen.
- Movement is driven by a single `requestAnimationFrame` loop in `Controls.tsx` (not React state), so per-frame input has zero render cost.
- All scene-graph state (player position, phase, seen milestones) is centralised in Zustand — no prop drilling, easy to extend.

---

## Deploy

Deploys cleanly to [Vercel](https://vercel.com/new):

1. Push to GitHub (already at [github.com/AKASHNINJA/my-portfolio](https://github.com/AKASHNINJA/my-portfolio)).
2. Import the repo in Vercel and accept defaults.
3. Every push to `main` ships automatically.

Also works on Netlify, Cloudflare Pages, or any Node host via `npm run build && npm start`.

---

## License

MIT — feel free to fork and remix.
