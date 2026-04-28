'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'

export default function MilestoneCard() {
  const { phase, activeMilestone, closeMilestone } = useGameStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && phase === 'milestone') {
        e.preventDefault()
        closeMilestone(milestones.length)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, closeMilestone])

  const ms = activeMilestone !== null ? milestones[activeMilestone] : null

  return (
    <AnimatePresence>
      {phase === 'milestone' && ms && (
        <motion.div
          key="overlay"
          className="absolute inset-0 z-30 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(5,7,20,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={() => closeMilestone(milestones.length)}
          />

          {/* Card */}
          <motion.div
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
              {/* Decorative glow blob */}
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ background: ms.color }}
              />
              <div
                className="text-xs font-mono tracking-[0.2em] uppercase mb-1"
                style={{ color: ms.color }}
              >
                {ms.label}
              </div>
              <h2 className="text-xl font-black text-white leading-tight">{ms.title}</h2>
              {ms.subtitle && (
                <p className="text-sm mt-1" style={{ color: `${ms.color}cc` }}>
                  {ms.subtitle}
                </p>
              )}
            </div>

            {/* Items */}
            <div
              className="px-6 py-4 max-h-60 overflow-y-auto space-y-2 scrollbar-hide"
              style={{ background: '#0b0b1e' }}
            >
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

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5" style={{ background: '#0b0b1e' }}>
              <motion.button
                onClick={() => closeMilestone(milestones.length)}
                className="w-full py-3 rounded-xl font-black text-sm tracking-widest uppercase text-black transition-all"
                style={{ background: ms.color }}
                whileHover={{ scale: 1.02, boxShadow: `0 0 24px ${ms.color}88` }}
                whileTap={{ scale: 0.97 }}
              >
                Continue Exploring →
              </motion.button>
              <p className="text-center text-gray-600 text-xs mt-2 font-mono">
                press SPACE or ENTER
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
