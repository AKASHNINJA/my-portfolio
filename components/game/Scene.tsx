'use client'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'
import { milestones, GAME_SPEED } from '@/lib/gameData'
import Track from './Track'
import Player from './Player'
import Gate from './Gate'
import City from './City'

const CAM_POS = new THREE.Vector3(0, 3.8, 7.5)
const CAM_TARGET = new THREE.Vector3(0, 0.8, -4)

export default function Scene() {
  const { tick, scrollZ, openMilestone, seenMilestones, phase } = useGameStore()
  const { camera } = useThree()

  useFrame((_, delta) => {
    tick(delta, GAME_SPEED)

    // Smooth camera position
    camera.position.lerp(CAM_POS, 0.1)
    camera.lookAt(CAM_TARGET)

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
      <fog attach="fog" args={['#050714', 45, 95]} />

      {/* Lighting */}
      <ambientLight intensity={0.12} />
      <directionalLight position={[5, 12, 5]} intensity={0.4} color="#ffffff" castShadow />
      <pointLight position={[0, 10, 0]} intensity={1.5} color="#00f5ff" distance={35} />
      <pointLight position={[-12, 6, -20]} intensity={0.8} color="#a855f7" distance={25} />
      <pointLight position={[12, 6, -20]} intensity={0.8} color="#a855f7" distance={25} />

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
