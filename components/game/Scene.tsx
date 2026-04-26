'use client'
import { useFrame } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
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

    // Fixed third-person camera behind the runner
    state.camera.position.set(0, 4.2, 8)
    state.camera.lookAt(0, 1.2, -6)

    // Milestone triggers
    milestones.forEach((m, i) => {
      if (!seenMilestones.includes(i)) {
        const relZ = scrollZ - m.position
        if (relZ >= -0.5 && relZ <= 2.5) openMilestone(i)
      }
    })
  })

  return (
    <>
      {/* Daylight sky */}
      <Sky sunPosition={[100, 60, -100]} turbidity={6} rayleigh={0.5} />
      <color attach="background" args={['#87ceeb']} />
      <fog attach="fog" args={['#d0e8f0', 60, 120]} />

      {/* Stadium lighting */}
      <ambientLight intensity={1.2} color="#fff9f0" />
      <directionalLight
        position={[30, 50, 20]}
        intensity={2.5}
        color="#fffde8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-20, 30, -10]} intensity={0.6} color="#c8e0ff" />

      {/* World */}
      <Track scrollZ={scrollZ} />
      <City scrollZ={scrollZ} />
      <Player />

      {/* Far ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -60]} receiveShadow>
        <planeGeometry args={[200, 600]} />
        <meshStandardMaterial color="#2d7a2d" roughness={0.95} />
      </mesh>

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
