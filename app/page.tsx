'use client'
import dynamic from 'next/dynamic'
import StartScreen from '@/components/game/StartScreen'
import MilestoneCard from '@/components/game/MilestoneCard'
import HUD from '@/components/game/HUD'
import Controls from '@/components/game/Controls'

const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#050f05]">
      <p className="text-green-400 font-mono text-sm animate-pulse tracking-widest">
        LOADING CITY...
      </p>
    </div>
  ),
})

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#87ceeb]">
      <GameCanvas />
      <Controls />
      <StartScreen />
      <MilestoneCard />
      <HUD />
    </div>
  )
}
