'use client'
import { motion } from 'framer-motion'
import { Building2, Home, BookOpen, Award, Briefcase, Wrench, Mail } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'

const ZONE_ICONS: Record<string, LucideIcon> = {
  hero: Home,
  education: BookOpen,
  achievements: Award,
  everstage: Briefcase,
  chargebee: Building2,
  skills: Wrench,
  contact: Mail,
}

export default function StartScreen() {
  const { phase, start } = useGameStore()
  if (phase !== 'intro') return null

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={{ background: 'rgba(5,15,5,0.87)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center px-6 max-w-xl w-full"
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Label */}
        <motion.div
          className="flex items-center justify-center gap-2 text-xs font-mono tracking-[0.28em] uppercase mb-5"
          style={{ color: '#88aaff' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Building2 size={14} aria-hidden="true" />
          Interactive Portfolio City
        </motion.div>

        {/* Title */}
        <h1 className="font-black text-white leading-none mb-1" style={{ fontSize: 'clamp(52px,10vw,88px)' }}>
          Akash<span style={{ color: '#8aca44' }}>.</span>
        </h1>
        <p className="text-gray-300 text-base mb-8 mt-2 leading-relaxed">
          Roam freely through the city — each district reveals a chapter of my career journey
        </p>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 mb-8 text-xs font-mono max-w-sm mx-auto">
          <div
            className="flex flex-col items-center gap-2 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex gap-1">
              {['W','A','S','D'].map(k => (
                <kbd key={k} className="text-white px-2 py-1 rounded text-xs font-bold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  {k}
                </kbd>
              ))}
            </div>
            <span className="text-gray-500">Move Around</span>
          </div>
          <div
            className="flex flex-col items-center gap-2 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <kbd className="text-white px-4 py-1 rounded text-xs font-bold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
              SPACE
            </kbd>
            <span className="text-gray-500">Continue / Dismiss</span>
          </div>
        </div>

        {/* Zone preview */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {milestones.map((m, i) => {
            const Icon = ZONE_ICONS[m.id] ?? Building2
            return (
              <motion.span
                key={m.id}
                className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full"
                style={{ border: `1px solid ${m.color}44`, color: m.color + 'aa', background: m.color + '0a' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Icon size={11} aria-hidden="true" />
                {m.label.replace('— ', '')}
              </motion.span>
            )
          })}
        </div>

        {/* CTA */}
        <motion.button
          onClick={start}
          aria-label="Enter the City"
          className="inline-flex items-center gap-2 px-14 py-4 font-black text-lg rounded-full tracking-wider"
          style={{
            background: 'linear-gradient(135deg, #2244aa, #4488ff)',
            color: '#e8f0ff',
            boxShadow: '0 4px 24px rgba(68,136,255,0.4)',
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 6px 32px rgba(68,136,255,0.6)' }}
          whileTap={{ scale: 0.96 }}
        >
          <Building2 size={20} aria-hidden="true" />
          Enter the City
        </motion.button>
        <p className="text-gray-600 text-xs mt-3 font-mono">or press SPACE</p>

        {/* Mobile hint */}
        <p className="text-gray-600 text-xs mt-2 font-mono md:hidden">
          on mobile: drag anywhere to move
        </p>
      </motion.div>
    </motion.div>
  )
}
