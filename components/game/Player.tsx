'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'

export default function Player() {
  const groupRef = useRef<THREE.Group>(null)
  const { phase } = useGameStore()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    if (phase === 'running') {
      // Running bob & lean
      groupRef.current.position.y = Math.abs(Math.sin(t * 9)) * 0.12
      groupRef.current.rotation.z = Math.sin(t * 9) * 0.04
    } else {
      // Idle float
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.05
      groupRef.current.rotation.z = 0
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Legs */}
      <LegArm position={[-0.18, 0.1, 0]} />
      <LegArm position={[0.18, 0.1, 0]} mirror />

      {/* Torso */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.42, 0.55, 0.22]} />
        <meshStandardMaterial
          color="#001a1f"
          emissive="#00f5ff"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Arms */}
      <ArmMesh position={[-0.32, 0.72, 0]} />
      <ArmMesh position={[0.32, 0.72, 0]} mirror />

      {/* Head */}
      <mesh position={[0, 1.17, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.9}
          roughness={0.05}
          metalness={1}
        />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 1.14, 0.14]}>
        <boxGeometry args={[0.28, 0.1, 0.06]} />
        <meshStandardMaterial color="#001a1f" emissive="#00f5ff" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>

      {/* Glow */}
      <pointLight position={[0, 0.8, 0]} color="#00f5ff" intensity={3} distance={4} />
    </group>
  )
}

function LegArm({ position, mirror }: { position: [number, number, number]; mirror?: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const { phase } = useGameStore()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    if (phase === 'running') {
      ref.current.rotation.x = (mirror ? -1 : 1) * Math.sin(t * 9) * 0.5
    }
  })

  return (
    <mesh ref={ref} position={position} castShadow>
      <capsuleGeometry args={[0.09, 0.38, 4, 8]} />
      <meshStandardMaterial
        color="#001a1f"
        emissive="#00f5ff"
        emissiveIntensity={0.3}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  )
}

function ArmMesh({ position, mirror }: { position: [number, number, number]; mirror?: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const { phase } = useGameStore()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    if (phase === 'running') {
      ref.current.rotation.x = (mirror ? 1 : -1) * Math.sin(t * 9) * 0.4
    }
  })

  return (
    <mesh ref={ref} position={position} castShadow>
      <capsuleGeometry args={[0.07, 0.3, 4, 8]} />
      <meshStandardMaterial
        color="#001a1f"
        emissive="#00f5ff"
        emissiveIntensity={0.25}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  )
}
