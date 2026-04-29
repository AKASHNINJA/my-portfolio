'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'

export default function MilestoneCard() {
  const { phase, activeMilestone, closeMilestone } = useGameStore()
  const cardRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const ms = activeMilestone !== null ? milestones[activeMilestone] : null

  // Save focus, focus card on open; restore on close
  useEffect(() => {
    if (phase === 'milestone') {
      previousFocusRef.current = document.activeElement as HTMLElement
      const firstButton = cardRef.current?.querySelector<HTMLElement>('button')
      firstButton?.focus()
    } else {
      previousFocusRef.current?.focus()
    }
  }, [phase])

  // Escape key + focus trap
  useEffect(() => {
    if (phase !== 'milestone') return

    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        closeMilestone(milestones.length)
        return
      }

      if (e.key === 'Tab' && cardRef.current) {
        const focusable = Array.from(
          cardRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.hasAttribute('disabled'))
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, closeMilestone])

  const close = () => closeMilestone(milestones.length)

  return (
    <AnimatePresence>
      {phase === 'milestone' && ms && (
        <motion.div
          key="overlay"
          className="absolute inset-0 z-30 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(5,7,20,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={close}
            aria-hidden="true"
          />

          {/* Card */}
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="milestone-title"
            className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: `1px solid ${ms.color}44` }}
            initial={{ scale: 0.85, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          >
            {/* Header */}
            <div
              className="px-6 pt-5 pb-4 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${ms.color}22, ${ms.color}08)` }}
            >
              <div
                aria-hidden="true"
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ background: ms.color }}
              />
              {/* Close button */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-3 right-3 p-2 rounded-full transition-colors"
                style={{ color: `${ms.color}cc`, background: `${ms.color}18` }}
              >
                <X size={16} />
              </button>
              <div
                className="text-xs font-mono tracking-[0.2em] uppercase mb-1"
                style={{ color: ms.color }}
              >
                {ms.label}
              </div>
              <h2 id="milestone-title" className="text-xl font-black text-white leading-tight pr-8">
                {ms.title}
              </h2>
              {ms.subtitle && (
                <p className="text-sm mt-1" style={{ color: `${ms.color}cc` }}>
                  {ms.subtitle}
                </p>
              )}
            </div>

            {/* Items with scroll overflow affordance */}
            <div className="relative" style={{ background: '#0b0b1e' }}>
              <div className="px-6 py-4 max-h-60 overflow-y-auto space-y-2 scrollbar-hide">
                {ms.items.map((item, i) => (
                  <motion.p
                    key={i}
                    className="text-sm text-gray-300 leading-relaxed"
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.06 + i * 0.05 }}
                  >
                    {item}
                  </motion.p>
                ))}
              </div>
              {/* Fade gradient — signals scrollable overflow */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent, #0b0b1e)' }}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5" style={{ background: '#0b0b1e' }}>
              <motion.button
                onClick={close}
                className="w-full py-3 rounded-xl font-black text-sm tracking-widest uppercase text-black transition-all"
                style={{ background: ms.color }}
                whileHover={{ scale: 1.02, boxShadow: `0 0 24px ${ms.color}88` }}
                whileTap={{ scale: 0.97 }}
              >
                Continue Exploring →
              </motion.button>
              <p className="text-center text-gray-600 text-xs mt-2 font-mono">
                press SPACE, ENTER or ESC
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
