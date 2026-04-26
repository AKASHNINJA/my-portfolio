'use client'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useGameStore } from '@/store/gameStore'
import { milestones, GAME_SPEED } from '@/lib/gameData'
import Track from './Track'
import Player from './Player'
import Gate from './Gate'
import City from './City'

export default function Scene() {
  const { tick, scrollZ, openMilestone, seenMilestones } = useGameStore()

  useFrame((state, delta) => {
    tick(delta, GAME_SPEED)

    // Camera: stay behind and above player, look ahead
    state.camera.position.set(0, 3.8, 7.5)
    state.camera.lookAt(0, 0.8, -4)

    // Trigger milestone gates
    milestones.forEach((m, i) => {
      if (!seenMilestones.includes(i)) {
        const relZ = scrollZ - m.position
        if (relZ >= -0.5 && relZ <= 2.5) {
          openMilestone(i)
        }
      }
    })
  })

  return (
    <>
      <color attach="background" args={['#050714']} />
      <fog attach="fog" args={['#050714', 50, 100]} />

      {/* Lighting — bright enough to see the neon track */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 12, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 8, 0]} intensity={3} color="#00f5ff" distance={40} />
      <pointLight position={[-10, 5, -15]} intensity={1.5} color="#a855f7" distance={30} />
      <pointLight position={[10, 5, -15]} intensity={1.5} color="#a855f7" distance={30} />

      {/* Sky */}
      <Stars radius={130} depth={70} count={5000} factor={4} saturation={0} fade speed={0.3} />

      {/* World */}
      <Track scrollZ={scrollZ} />
      <City scrollZ={scrollZ} />
      <Player />

      {/* Milestone gates */}
      {milestones.map((m, i) => (
        <Gate
          key={m.id}
          milestone={m}
          worldZ={scrollZ - m.position}
          seen={seenMilestones.includes(i)}
        />
      ))}
    </>
  )
}
