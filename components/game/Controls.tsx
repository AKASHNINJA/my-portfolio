'use client'
import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'

export default function Controls() {
  const { moveLane, startJump, phase, closeMilestone, start } = useGameStore()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === 'intro') {
        if (e.code === 'Space') { e.preventDefault(); start() }
        return
      }
      if (phase === 'milestone') {
        if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); closeMilestone(milestones.length) }
        return
      }
      if (phase === 'running') {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); moveLane(-1) }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); moveLane(1) }
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); startJump() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, moveLane, startJump, closeMilestone, start])

  return null
}
