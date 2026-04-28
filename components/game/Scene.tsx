'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'
import City from './City'
import Player from './Player'

export default function Scene() {
  const { tick, openMilestone } = useGameStore()
  const triggeredRef = useRef(new Set<number>())

  useFrame((state, delta) => {
    const { playerX, playerZ, phase, seenMilestones } = useGameStore.getState()
    tick(delta)

    // Smooth camera follow (third-person behind+above)
    const camTargetX = playerX
    const camTargetY = 14
    const camTargetZ = playerZ + 18

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, camTargetX, delta * 6)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, camTargetY, delta * 6)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, camTargetZ, delta * 6)
    state.camera.lookAt(playerX, 0.5, playerZ - 5)

    // Zone detection — trigger once when player enters zone
    if (phase === 'roaming') {
      milestones.forEach((m, i) => {
        if (seenMilestones.includes(i)) return
        const dx = playerX - m.zoneX
        const dz = playerZ - m.zoneZ
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < m.zoneRadius * 0.75 && !triggeredRef.current.has(i)) {
          triggeredRef.current.add(i)
          openMilestone(i)
        }
        // Reset trigger when player leaves (so re-entry doesn't retrigger)
        if (dist > m.zoneRadius && triggeredRef.current.has(i) && seenMilestones.includes(i)) {
          triggeredRef.current.delete(i)
        }
      })
    }
  })

  return (
    <>
      {/* City dusk sky */}
      <Sky sunPosition={[40, 12, -80]} turbidity={8} rayleigh={1.2} mieCoefficient={0.008} mieDirectionalG={0.85} />
      <color attach="background" args={['#8090b8']} />
      <fog attach="fog" args={['#6070a8', 90, 180]} />

      {/* Lighting */}
      <ambientLight intensity={0.7} color="#c8d0f0" />
      <directionalLight
        position={[40, 50, 30]}
        intensity={1.6}
        color="#ffe8d0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-20, 30, -20]} intensity={0.4} color="#a0b8ff" />
      <hemisphereLight args={['#8090b8', '#303030', 0.5]} />

      <City />
      <Player />
    </>
  )
}
