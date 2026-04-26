import { profile, experience, education, skills, achievements } from './data'

export interface Milestone {
  id: string
  label: string
  title: string
  subtitle?: string
  items: string[]
  color: string
  position: number // world-Z distance from start
}

export const GATE_INTERVAL = 60
export const GAME_SPEED = 10

export const milestones: Milestone[] = [
  {
    id: 'hero',
    label: '01 — HELLO',
    title: profile.name,
    subtitle: profile.title,
    items: [
      `📍 ${profile.location}`,
      `✉️ ${profile.email}`,
      `📱 ${profile.phone}`,
      profile.tagline,
    ],
    color: '#00f5ff',
    position: 1 * GATE_INTERVAL,
  },
  {
    id: 'education',
    label: '02 — EDUCATION',
    title: 'Academic Journey',
    subtitle: 'Building the foundation',
    items: education.flatMap(e => [
      `🎓 ${e.qualification}`,
      `🏫 ${e.school}  (${e.period})`,
      ...e.details.map(d => `   ⭐ ${d}`),
    ]),
    color: '#a855f7',
    position: 2 * GATE_INTERVAL,
  },
  {
    id: 'achievements',
    label: '03 — ACHIEVEMENTS',
    title: 'Milestones & Recognition',
    subtitle: 'Academic excellence & research',
    items: achievements.map(a => `🏆 ${a.title}: ${a.description}`),
    color: '#f59e0b',
    position: 3 * GATE_INTERVAL,
  },
  {
    id: 'everstage',
    label: '04 — EVERSTAGE',
    title: experience[1].role,
    subtitle: `${experience[1].company}  ·  ${experience[1].period}`,
    items: experience[1].bullets.map(b => `▸ ${b}`),
    color: '#10b981',
    position: 4 * GATE_INTERVAL,
  },
  {
    id: 'chargebee',
    label: '05 — CHARGEBEE',
    title: experience[0].role,
    subtitle: `${experience[0].company}  ·  ${experience[0].period}`,
    items: experience[0].bullets.map(b => `▸ ${b}`),
    color: '#3b82f6',
    position: 5 * GATE_INTERVAL,
  },
  {
    id: 'skills',
    label: '06 — SKILLS',
    title: 'My Toolkit',
    subtitle: 'Tools & technologies I work with',
    items: [
      '⚡ Implementation: ' + skills.filter(s => s.category === 'Product & Implementation').map(s => s.name).join(' · '),
      '🔧 Platforms: ' + skills.filter(s => s.category === 'Tools & Platforms').map(s => s.name).join(' · '),
      '🌐 Domains: ' + skills.filter(s => s.category === 'Domain').map(s => s.name).join(' · '),
      '🤖 AI & Automation: ' + skills.filter(s => s.category === 'AI & Automation').map(s => s.name).join(' · '),
    ],
    color: '#ec4899',
    position: 6 * GATE_INTERVAL,
  },
  {
    id: 'contact',
    label: '07 — CONNECT',
    title: "Let's Connect!",
    subtitle: 'Open to opportunities & collaborations',
    items: [
      `✉️ ${profile.email}`,
      `📱 ${profile.phone}`,
      `💼 linkedin.com/in/akash-premkumar-a95a42161`,
      `🐙 github.com/AKASHNINJA`,
    ],
    color: '#f97316',
    position: 7 * GATE_INTERVAL,
  },
]
