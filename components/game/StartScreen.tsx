'use client'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

export default function StartScreen() {
  const { phase, start } = useGameStore()
  if (phase !== 'intro') return null

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={{ background: 'rgba(5,7,20,0.85)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-center px-6 max-w-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="text-xs font-mono tracking-[0.25em] text-yellow-400 uppercase mb-4">
          🏟️ Olympic Portfolio Games
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white mb-1 leading-none">
          Akash<span className="text-red-500">.</span>
        </h1>
        <p className="text-gray-300 text-base mb-8 mt-3">
          Run through 7 career milestones on the Olympic track
        </p>

        {/* Controls legend */}
        <div className="grid grid-cols-3 gap-3 mb-8 text-xs font-mono">
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              <kbd className="border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-xs">←</kbd>
              <kbd className="border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-xs">→</kbd>
            </div>
            <span className="text-gray-500">Switch Lane</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <kbd className="border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded text-xs">↑ / W</kbd>
            <span className="text-gray-500">Jump</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <kbd className="border border-gray-600 bg-gray-800 text-white px-3 py-1 rounded text-xs">SPACE</kbd>
            <span className="text-gray-500">Continue</span>
          </div>
        </div>

        <motion.button
          onClick={start}
          className="px-12 py-4 bg-red-600 text-white font-black text-lg rounded-full tracking-wider hover:bg-red-500 transition-colors"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          🏃 START RACE
        </motion.button>
        <p className="text-gray-600 text-xs mt-3 font-mono">or press SPACE</p>

        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {['Hello','Education','Achievements','Everstage','Chargebee','Skills','Connect'].map((label, i) => (
            <span key={i} className="text-xs font-mono px-2 py-1 rounded border border-white/10 text-gray-500">
              {String(i + 1).padStart(2, '0')} {label}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
