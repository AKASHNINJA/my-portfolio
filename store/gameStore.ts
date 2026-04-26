'use client'
import { create } from 'zustand'

export type Phase = 'intro' | 'running' | 'milestone' | 'complete'

interface GameStore {
  phase: Phase
  scrollZ: number
  activeMilestone: number | null
  seenMilestones: number[]

  // Player movement
  lane: -1 | 0 | 1
  playerX: number
  playerY: number
  isJumping: boolean
  jumpTime: number
  isStumbling: boolean
  stumbleCount: number

  start: () => void
  tick: (delta: number, speed: number) => void
  openMilestone: (i: number) => void
  closeMilestone: (total: number) => void
  reset: () => void
  moveLane: (dir: -1 | 1) => void
  startJump: () => void
  setPlayerX: (x: number) => void
  setPlayerY: (y: number) => void
  landJump: () => void
  stumble: () => void
}

export const LANE_X = [-2.4, 0, 2.4] // x positions for lanes -1, 0, 1

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'intro',
  scrollZ: 0,
  activeMilestone: null,
  seenMilestones: [],
  lane: 0,
  playerX: 0,
  playerY: 0,
  isJumping: false,
  jumpTime: 0,

  start: () => set({
    phase: 'running', scrollZ: 0,
    seenMilestones: [], activeMilestone: null,
    lane: 0, playerX: 0, playerY: 0, isJumping: false,
  }),

  tick: (delta, speed) => {
    if (get().phase !== 'running') return
    set(s => ({ scrollZ: s.scrollZ + speed * delta }))
  },

  openMilestone: (i) => {
    const { seenMilestones, phase } = get()
    if (seenMilestones.includes(i) || phase !== 'running') return
    set({ phase: 'milestone', activeMilestone: i })
  },

  closeMilestone: (total) => {
    const { activeMilestone, seenMilestones } = get()
    if (activeMilestone === null) return
    const next = [...seenMilestones, activeMilestone]
    set({
      phase: next.length >= total ? 'complete' : 'running',
      activeMilestone: null,
      seenMilestones: next,
    })
  },

  reset: () => set({
    phase: 'intro', scrollZ: 0, activeMilestone: null,
    seenMilestones: [], lane: 0, playerX: 0, playerY: 0, isJumping: false,
  }),

  moveLane: (dir) => {
    const { lane, phase } = get()
    if (phase !== 'running') return
    const next = Math.max(-1, Math.min(1, lane + dir)) as -1 | 0 | 1
    set({ lane: next })
  },

  startJump: () => {
    const { isJumping, phase } = get()
    if (isJumping || phase !== 'running') return
    set({ isJumping: true, jumpTime: 0 })
  },

  setPlayerX: (playerX) => set({ playerX }),
  setPlayerY: (playerY) => set({ playerY }),
  landJump: () => set({ isJumping: false, playerY: 0, jumpTime: 0 }),
}))
