'use client'
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'

const JOYSTICK_RADIUS = 48
const KNOB_RADIUS = 20

export default function Controls() {
  const keysRef = useRef(new Set<string>())
  const rafRef = useRef<number>()
  const joystickRef = useRef({ baseX: 0, baseY: 0, active: false })
  const [joystick, setJoystick] = useState<{ baseX: number; baseY: number; knobX: number; knobY: number } | null>(null)

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code)
      const { phase, start, closeMilestone } = useGameStore.getState()
      if (e.code === 'Space' && phase === 'intro') { e.preventDefault(); start() }
      if ((e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') && phase === 'milestone') {
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

  // Touch joystick — only active during roaming phase
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (useGameStore.getState().phase !== 'roaming') return
      const touch = e.changedTouches[0]
      joystickRef.current = { baseX: touch.clientX, baseY: touch.clientY, active: true }
      setJoystick({ baseX: touch.clientX, baseY: touch.clientY, knobX: touch.clientX, knobY: touch.clientY })
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!joystickRef.current.active) return
      e.preventDefault()
      const touch = e.changedTouches[0]
      const { baseX, baseY } = joystickRef.current
      const dx = touch.clientX - baseX
      const dy = touch.clientY - baseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const clamped = Math.min(dist, JOYSTICK_RADIUS)
      const angle = Math.atan2(dy, dx)
      setJoystick({
        baseX, baseY,
        knobX: baseX + Math.cos(angle) * clamped,
        knobY: baseY + Math.sin(angle) * clamped,
      })
      const norm = dist > 8 ? 1 : 0
      useGameStore.getState().setMove(
        norm ? dx / dist : 0,
        norm ? dy / dist : 0,
      )
    }

    const onTouchEnd = () => {
      joystickRef.current.active = false
      setJoystick(null)
      useGameStore.getState().setMove(0, 0)
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchcancel', onTouchEnd)
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [])

  if (!joystick) return null

  const { baseX, baseY, knobX, knobY } = joystick

  return (
    <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
      {/* Base ring */}
      <div
        style={{
          position: 'absolute',
          left: baseX - JOYSTICK_RADIUS,
          top: baseY - JOYSTICK_RADIUS,
          width: JOYSTICK_RADIUS * 2,
          height: JOYSTICK_RADIUS * 2,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          border: '2px solid rgba(255,255,255,0.22)',
        }}
      />
      {/* Knob */}
      <div
        style={{
          position: 'absolute',
          left: knobX - KNOB_RADIUS,
          top: knobY - KNOB_RADIUS,
          width: KNOB_RADIUS * 2,
          height: KNOB_RADIUS * 2,
          borderRadius: '50%',
          background: 'rgba(68,136,255,0.65)',
          border: '2px solid rgba(68,136,255,0.9)',
        }}
      />
    </div>
  )
}
