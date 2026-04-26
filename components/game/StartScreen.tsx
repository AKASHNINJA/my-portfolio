'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

export default function StartScreen() {
  const { phase, start } = useGameStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && phase === 'intro') {
        e.preventDefault()
        start()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, start])

  if (phase !== 'intro') return null

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={{ background: 'rgba(5,7,20,0.82)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center px-6 max-w-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Tag */}
        <div className="text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase mb-5">
          Interactive 3D Portfolio
        </div>

        {/* Name */}
        <h1 className="text-6xl md:text-8xl font-black text-white mb-1 leading-none">
          Akash<span className="text-cyan-400">.</span>
        </h1>
        <p className="text-gray-400 text-base mb-10 mt-3">
          Implementation Consultant · Product-minded Builder
        </p>

        {/* Instructions */}
        <div className="flex gap-4 justify-center text-xs font-mono text-gray-500 mb-10">
          <span className="border border-gray-700 px-2 py-1 rounded">SPACE</span>
          <span className="self-center text-gray-600">to continue at milestones</span>
        </div>

        {/* CTA */}
        <motion.button
          onClick={start}
          className="px-12 py-4 bg-cyan-400 text-black font-black text-lg rounded-full tracking-wider"
          whileHover={{ scale: 1.06, boxShadow: '0 0 40px #00f5ff88' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          START RUNNING →
        </motion.button>
        <p className="text-gray-600 text-xs mt-3 font-mono">or press SPACE</p>

        {/* Checkpoint preview */}
        <div className="mt-10 flex flex-wrap gap-2 justify-center">
          {['Hello', 'Education', 'Achievements', 'Everstage', 'Chargebee', 'Skills', 'Connect'].map((label, i) => (
            <span
              key={i}
              className="text-xs font-mono px-2 py-1 rounded border border-white/10 text-gray-500"
            >
              {String(i + 1).padStart(2, '0')} {label}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
