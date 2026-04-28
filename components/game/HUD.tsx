'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'

export default function HUD() {
  const { phase, seenMilestones } = useGameStore()
  if (phase === 'intro') return null

  const progress = seenMilestones.length / milestones.length

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-4 left-0 right-0 z-10 px-5 flex items-start justify-between pointer-events-none">
        {/* Zone counter */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="backdrop-blur-sm rounded-xl px-3 py-2"
          style={{ background: 'rgba(10,15,30,0.65)', border: '1px solid rgba(80,120,255,0.25)' }}
        >
          <div className="text-blue-400 text-xs font-mono tracking-wider mb-1" style={{ fontSize: '10px' }}>
            DISTRICTS VISITED
          </div>
          <div className="flex items-center gap-2">
            <div className="text-white font-black text-base">
              {seenMilestones.length}
              <span className="text-blue-400 font-normal text-sm"> / {milestones.length}</span>
            </div>
          </div>
          <div className="mt-1.5 h-[3px] w-28 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #2244aa, #4488ff)' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>

        {/* Controls reminder */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="backdrop-blur-sm rounded-xl px-3 py-2 text-right"
          style={{ background: 'rgba(10,15,30,0.5)', border: '1px solid rgba(80,120,255,0.18)' }}
        >
          <div className="text-gray-400 text-xs font-mono" style={{ fontSize: '10px' }}>WASD / ARROWS to move</div>
        </motion.div>
      </div>

      {/* Zone dot map */}
      <div className="absolute bottom-5 left-0 right-0 z-10 flex justify-center gap-2.5 pointer-events-none">
        {milestones.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-1"
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: seenMilestones.includes(i) ? m.color : 'rgba(255,255,255,0.12)',
                boxShadow: seenMilestones.includes(i) ? `0 0 8px ${m.color}` : 'none',
                transition: 'all 0.4s ease',
              }}
            />
            <span style={{ fontSize: 8, color: seenMilestones.includes(i) ? m.color : 'rgba(255,255,255,0.25)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              {m.zoneIcon}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Complete screen */}
      <AnimatePresence>
        {phase === 'complete' && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            style={{ background: 'rgba(5,8,20,0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-center px-8 max-w-lg"
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring', damping: 20, stiffness: 280 }}
            >
              <div className="text-blue-400 font-mono text-xs tracking-widest mb-4 uppercase">
                City Fully Explored!
              </div>
              <h2 className="text-5xl font-black text-white mb-3 leading-tight">
                All Districts Visited 🏙️
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Thanks for exploring my city. Let's connect and build something great together.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <motion.a
                  href="mailto:akashninja1123@gmail.com"
                  className="px-8 py-3 font-black rounded-full text-sm tracking-wider"
                  style={{ background: 'linear-gradient(135deg, #2244aa, #4488ff)', color: '#e8f0ff' }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(68,136,255,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get in Touch
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/akash-premkumar-a95a42161/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 font-black rounded-full text-sm tracking-wider"
                  style={{ border: '2px solid rgba(68,136,255,0.5)', color: '#88aaff' }}
                  whileHover={{ scale: 1.05, background: 'rgba(68,136,255,0.1)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  LinkedIn
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
