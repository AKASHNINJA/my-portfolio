'use client'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'

export default function HUD() {
  const { phase, scrollZ, seenMilestones } = useGameStore()
  if (phase === 'intro') return null

  const total = milestones[milestones.length - 1].position + 60
  const progress = Math.min(scrollZ / total, 1)
  const nextIdx = milestones.findIndex((_, i) => !seenMilestones.includes(i))
  const next = nextIdx >= 0 ? milestones[nextIdx] : null

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-4 left-0 right-0 z-10 px-5 flex items-start justify-between pointer-events-none">
        {/* Progress */}
        <div className="min-w-[180px]">
          <div className="text-yellow-600 text-xs font-mono mb-1 tracking-wider font-bold">
            🏅 {seenMilestones.length} / {milestones.length} CHECKPOINTS
          </div>
          <div className="h-[4px] bg-black/20 rounded-full overflow-hidden w-44">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%`, background: '#c8102e' }}
            />
          </div>
        </div>

        {/* Next gate */}
        {next && (
          <div className="text-right">
            <div className="text-gray-600 text-xs font-mono">NEXT GATE</div>
            <div className="text-xs font-mono font-bold" style={{ color: next.color }}>
              {next.label}
            </div>
          </div>
        )}
      </div>

      {/* Dot map at bottom */}
      <div className="absolute bottom-5 left-0 right-0 z-10 flex justify-center gap-2 pointer-events-none">
        {milestones.map((m, i) => (
          <div
            key={m.id}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: seenMilestones.includes(i) ? m.color : 'rgba(255,255,255,0.15)',
              boxShadow: seenMilestones.includes(i) ? `0 0 6px ${m.color}` : 'none',
            }}
          />
        ))}
      </div>

      {/* Complete banner */}
      {phase === 'complete' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ background: 'rgba(5,7,20,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="text-center px-8">
            <div className="text-cyan-400 font-mono text-sm tracking-widest mb-4 uppercase">You made it!</div>
            <h2 className="text-5xl font-black text-white mb-3">All Checkpoints Cleared 🏆</h2>
            <p className="text-gray-400 mb-8">Thanks for running through my journey.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="mailto:akashninja1123@gmail.com"
                className="px-8 py-3 bg-cyan-400 text-black font-black rounded-full hover:bg-cyan-300 transition-colors"
              >
                ✉️ Get in Touch
              </a>
              <a
                href="https://www.linkedin.com/in/akash-premkumar-a95a42161/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-cyan-400 text-cyan-400 font-black rounded-full hover:bg-cyan-400/10 transition-colors"
              >
                💼 LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
