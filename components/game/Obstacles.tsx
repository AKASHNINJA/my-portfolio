'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
const LANE_X = [-2.4, 0, 2.4]

export interface Obstacle {
  pos:  number
  lane: -1 | 0 | 1
}

// Two hurdles between each milestone (milestone positions: 60,120,180,240,300,360,420)
export const OBSTACLES: Obstacle[] = [
  { pos:  26, lane:  1 },
  { pos:  44, lane: -1 },
  { pos:  82, lane:  0 },
  { pos: 100, lane:  1 },
  { pos: 142, lane: -1 },
  { pos: 160, lane:  0 },
  { pos: 202, lane:  1 },
  { pos: 220, lane: -1 },
  { pos: 262, lane:  0 },
  { pos: 280, lane:  1 },
  { pos: 322, lane: -1 },
  { pos: 340, lane:  0 },
  { pos: 382, lane:  1 },
  { pos: 400, lane: -1 },
]

export const HURDLE_HEIGHT = 0.88   // bar height — player must jump above this
const RENDER_DIST = 80

function Hurdle({ worldZ, lane }: { worldZ: number; lane: -1 | 0 | 1 }) {
  const cx = LANE_X[lane + 1]
  const glowRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (glowRef.current && worldZ > -6) {
      glowRef.current.intensity = 1.2 + Math.sin(clock.getElapsedTime() * 7) * 0.5
    }
  })

  return (
    <group position={[0, 0, worldZ]}>
      {/* Left post */}
      <mesh position={[cx - 0.72, HURDLE_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.055, 0.065, HURDLE_HEIGHT, 8]} />
        <meshStandardMaterial color="#cc0000" metalness={0.55} roughness={0.3} />
      </mesh>
      {/* Right post */}
      <mesh position={[cx + 0.72, HURDLE_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.055, 0.065, HURDLE_HEIGHT, 8]} />
        <meshStandardMaterial color="#cc0000" metalness={0.55} roughness={0.3} />
      </mesh>
      {/* Cross bar */}
      <mesh position={[cx, HURDLE_HEIGHT, 0]}>
        <boxGeometry args={[1.5, 0.09, 0.09]} />
        <meshStandardMaterial
          color="white"
          emissive="#ffbbbb"
          emissiveIntensity={0.4}
          roughness={0.3}
        />
      </mesh>
      {/* Warning stripes on bar */}
      {[-0.45, 0, 0.45].map((ox, i) => (
        <mesh key={i} position={[cx + ox, HURDLE_HEIGHT, 0.05]}>
          <boxGeometry args={[0.18, 0.09, 0.005]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#cc0000' : 'white'} roughness={0.4} />
        </mesh>
      ))}
      {/* Left base foot */}
      <mesh position={[cx - 0.72, 0.045, 0.28]}>
        <boxGeometry args={[0.28, 0.09, 0.56]} />
        <meshStandardMaterial color="#777" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Right base foot */}
      <mesh position={[cx + 0.72, 0.045, 0.28]}>
        <boxGeometry args={[0.28, 0.09, 0.56]} />
        <meshStandardMaterial color="#777" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Proximity glow */}
      {worldZ > -10 && (
        <pointLight ref={glowRef} position={[cx, 1.5, 0]} color="#ff4444" intensity={1.5} distance={8} />
      )}
    </group>
  )
}

export default function Obstacles({ scrollZ }: { scrollZ: number }) {
  return (
    <group>
      {OBSTACLES.map((o, i) => {
        const worldZ = scrollZ - o.pos
        if (worldZ < -RENDER_DIST || worldZ > 4) return null
        return <Hurdle key={i} worldZ={worldZ} lane={o.lane} />
      })}
    </group>
  )
}
