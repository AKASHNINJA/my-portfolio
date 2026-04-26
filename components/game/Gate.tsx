'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import type { Milestone } from '@/lib/gameData'

interface GateProps {
  milestone: Milestone
  worldZ: number  // scrollZ - milestone.position; 0 = at player, negative = ahead
  seen: boolean
}

export default function Gate({ milestone, worldZ, seen }: GateProps) {
  const lightRef = useRef<THREE.PointLight>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const isNear = worldZ > -12 && worldZ < 3

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (isNear && !seen) {
      const pulse = 0.7 + Math.sin(t * 5) * 0.3
      if (lightRef.current) lightRef.current.intensity = pulse * 5
      if (glowRef.current) {
        const mat = glowRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = pulse * 0.18
      }
    }
  })

  // Only render when in range
  if (worldZ > 6 || worldZ < -100) return null

  const c = milestone.color
  const emI = seen ? 0.15 : 1.2

  return (
    <group position={[0, 0, worldZ]}>
      {/* Left pillar */}
      <mesh position={[-3.6, 2.2, 0]} castShadow>
        <boxGeometry args={[0.28, 4.4, 0.28]} />
        <meshStandardMaterial color="#050714" emissive={c} emissiveIntensity={emI} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Right pillar */}
      <mesh position={[3.6, 2.2, 0]} castShadow>
        <boxGeometry args={[0.28, 4.4, 0.28]} />
        <meshStandardMaterial color="#050714" emissive={c} emissiveIntensity={emI} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Top bar */}
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[7.52, 0.28, 0.28]} />
        <meshStandardMaterial color="#050714" emissive={c} emissiveIntensity={emI} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Corner joints */}
      {([-3.6, 3.6] as number[]).map((x) => (
        <mesh key={x} position={[x, 4.5, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={emI * 1.5} roughness={0} metalness={1} />
        </mesh>
      ))}

      {/* Gate label */}
      <Text
        position={[0, 5.1, 0]}
        fontSize={0.32}
        color={c}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {milestone.label}
      </Text>

      {/* Gate glow fill */}
      {!seen && (
        <mesh ref={glowRef} position={[0, 2.2, 0.08]}>
          <planeGeometry args={[7.24, 4.4]} />
          <meshBasicMaterial color={c} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      {/* Ambient glow light */}
      {!seen && (
        <pointLight ref={lightRef} position={[0, 2.5, 0]} color={c} intensity={4} distance={15} />
      )}
    </group>
  )
}
