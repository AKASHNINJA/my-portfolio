'use client'
import { create } from 'zustand'

export type Phase = 'intro' | 'running' | 'milestone' | 'complete'

interface GameStore {
  phase: Phase
  scrollZ: number
  activeMilestone: number | null
  seenMilestones: number[]

  start: () => void
  tick: (delta: number, speed: number) => void
  openMilestone: (i: number) => void
  closeMilestone: (total: number) => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'intro',
  scrollZ: 0,
  activeMilestone: null,
  seenMilestones: [],

  start: () => set({ phase: 'running', scrollZ: 0, seenMilestones: [], activeMilestone: null }),

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

  reset: () => set({ phase: 'intro', scrollZ: 0, activeMilestone: null, seenMilestones: [] }),
}))
