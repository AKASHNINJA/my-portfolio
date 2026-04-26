'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Milestone } from '@/lib/gameData'

interface GateProps {
  milestone: Milestone
  worldZ: number
  seen: boolean
}

// Olympic ring colors cycle per milestone
const OLYMPIC_COLORS = ['#0057A8', '#000000', '#c8102e', '#ffd700', '#1a8c1a']

export default function Gate({ milestone, worldZ, seen }: GateProps) {
  const tapeRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const idx = ['hero','education','achievements','everstage','chargebee','skills','contact'].indexOf(milestone.id)
  const accentColor = OLYMPIC_COLORS[idx % OLYMPIC_COLORS.length]
  const isNear = worldZ > -10 && worldZ < 3

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (tapeRef.current && isNear && !seen) {
      // Tape flutter
      tapeRef.current.rotation.y = Math.sin(t * 6) * 0.04
      const mat = tapeRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.3 + Math.sin(t * 4) * 0.2
    }
    if (glowRef.current && isNear && !seen) {
      glowRef.current.intensity = 2 + Math.sin(t * 5) * 0.8
    }
  })

  if (worldZ > 6 || worldZ < -100) return null

  const emI = seen ? 0.1 : 0.9

  return (
    <group position={[0, 0, worldZ]}>
      {/* Left arch pillar */}
      <mesh position={[-5.7, 3, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 6, 12]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={emI} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Right arch pillar */}
      <mesh position={[5.7, 3, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 6, 12]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={emI} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Top crossbar */}
      <mesh position={[0, 6.15, 0]}>
        <boxGeometry args={[11.64, 0.44, 0.44]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={emI} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Finish-line tape */}
      <mesh ref={tapeRef} position={[0, 1.0, 0.05]}>
        <planeGeometry args={[11.24, 0.18]} />
        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={seen ? 0 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sponsor banner */}
      <mesh position={[0, 5.0, 0.1]}>
        <planeGeometry args={[9, 1.1]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={emI * 0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Banner label */}
      <Html position={[0, 5.02, 0.22]} center distanceFactor={10}>
        <div style={{
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '10px',
          fontWeight: 900,
          letterSpacing: '0.18em',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          pointerEvents: 'none',
        }}>
          {milestone.label}
        </div>
      </Html>

      {/* Olympic rings decoration on crossbar */}
      {OLYMPIC_COLORS.map((col, i) => (
        <mesh key={i} position={[-2.4 + i * 1.2, 6.15, 0.3]}>
          <torusGeometry args={[0.28, 0.07, 8, 20]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
      ))}

      {/* Glow light */}
      {!seen && (
        <pointLight ref={glowRef} position={[0, 3, 1]} color={accentColor} intensity={2.5} distance={18} />
      )}
    </group>
  )
}
