'use client'
import { create } from 'zustand'

export type Phase = 'intro' | 'roaming' | 'milestone' | 'complete'

const PLAYER_SPEED = 9
const FARM_MIN_X = -36
const FARM_MAX_X = 36
const FARM_MIN_Z = -128
const FARM_MAX_Z = 5

interface GameStore {
  phase: Phase
  playerX: number
  playerZ: number
  playerRotY: number
  moveX: number
  moveZ: number
  isMoving: boolean
  activeMilestone: number | null
  seenMilestones: number[]

  start: () => void
  setMove: (mx: number, mz: number) => void
  tick: (delta: number) => void
  openMilestone: (i: number) => void
  closeMilestone: (total: number) => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'intro',
  playerX: 0,
  playerZ: 2,
  playerRotY: Math.PI,
  moveX: 0,
  moveZ: 0,
  isMoving: false,
  activeMilestone: null,
  seenMilestones: [],

  start: () => set({
    phase: 'roaming',
    playerX: 0,
    playerZ: 2,
    playerRotY: Math.PI,
    moveX: 0,
    moveZ: 0,
    isMoving: false,
    activeMilestone: null,
    seenMilestones: [],
  }),

  setMove: (mx, mz) => set({ moveX: mx, moveZ: mz }),

  tick: (delta) => {
    const { phase, playerX, playerZ, moveX, moveZ } = get()
    if (phase !== 'roaming') return

    const len = Math.sqrt(moveX * moveX + moveZ * moveZ)
    if (len < 0.01) { set({ isMoving: false }); return }

    const nx = moveX / len
    const nz = moveZ / len
    const newX = Math.max(FARM_MIN_X, Math.min(FARM_MAX_X, playerX + nx * PLAYER_SPEED * delta))
    const newZ = Math.max(FARM_MIN_Z, Math.min(FARM_MAX_Z, playerZ + nz * PLAYER_SPEED * delta))
    const rotY = Math.atan2(nx, nz)

    set({ playerX: newX, playerZ: newZ, playerRotY: rotY, isMoving: true })
  },

  openMilestone: (i) => {
    const { seenMilestones, phase } = get()
    if (seenMilestones.includes(i) || phase !== 'roaming') return
    set({ phase: 'milestone', activeMilestone: i, isMoving: false })
  },

  closeMilestone: (total) => {
    const { activeMilestone, seenMilestones } = get()
    if (activeMilestone === null) return
    const next = [...seenMilestones, activeMilestone]
    set({
      phase: next.length >= total ? 'complete' : 'roaming',
      activeMilestone: null,
      seenMilestones: next,
    })
  },

  reset: () => set({
    phase: 'intro',
    playerX: 0,
    playerZ: 2,
    playerRotY: Math.PI,
    moveX: 0,
    moveZ: 0,
    isMoving: false,
    activeMilestone: null,
    seenMilestones: [],
  }),
}))
