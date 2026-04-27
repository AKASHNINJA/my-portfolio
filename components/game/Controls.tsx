'use client'
import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'

export default function Controls() {
  const keysRef = useRef(new Set<string>())
  const rafRef  = useRef<number>()

  // One-shot key events for phase transitions
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code)
      const { phase, start, closeMilestone } = useGameStore.getState()
      if (e.code === 'Space' && phase === 'intro') { e.preventDefault(); start() }
      if ((e.code === 'Space' || e.code === 'Enter') && phase === 'milestone') {
        e.preventDefault()
        closeMilestone(milestones.length)
      }
    }
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.code)
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  // Continuous movement polling
  useEffect(() => {
    function loop() {
      const k = keysRef.current
      const mx = (k.has('ArrowRight') || k.has('KeyD') ? 1 : 0)
               - (k.has('ArrowLeft')  || k.has('KeyA') ? 1 : 0)
      const mz = (k.has('ArrowDown')  || k.has('KeyS') ? 1 : 0)
               - (k.has('ArrowUp')    || k.has('KeyW') ? 1 : 0)
      useGameStore.getState().setMove(mx, mz)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return null
}
