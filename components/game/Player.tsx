'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'

export default function Player() {
  const rootRef   = useRef<THREE.Group>(null)
  const hipsRef   = useRef<THREE.Group>(null)
  const torsoRef  = useRef<THREE.Group>(null)

  const lThighRef = useRef<THREE.Group>(null)
  const lShinRef  = useRef<THREE.Group>(null)
  const rThighRef = useRef<THREE.Group>(null)
  const rShinRef  = useRef<THREE.Group>(null)

  const lUArmRef  = useRef<THREE.Group>(null)
  const lFArmRef  = useRef<THREE.Group>(null)
  const rUArmRef  = useRef<THREE.Group>(null)
  const rFArmRef  = useRef<THREE.Group>(null)
  const headRef   = useRef<THREE.Group>(null)

  useFrame(({ clock }, delta) => {
    const { playerX, playerZ, playerRotY, isMoving, phase } = useGameStore.getState()
    if (!rootRef.current) return

    const t = clock.getElapsedTime()

    // Smooth position follow
    rootRef.current.position.x = THREE.MathUtils.lerp(rootRef.current.position.x, playerX, delta * 14)
    rootRef.current.position.z = THREE.MathUtils.lerp(rootRef.current.position.z, playerZ, delta * 14)

    // Smooth rotation toward movement direction
    if (isMoving) {
      let diff = playerRotY - rootRef.current.rotation.y
      while (diff >  Math.PI) diff -= 2 * Math.PI
      while (diff < -Math.PI) diff += 2 * Math.PI
      rootRef.current.rotation.y += diff * Math.min(1, delta * 14)
    }

    const freq = isMoving ? 9 : 1.5

    if (isMoving) {
      const ph = t * freq
      if (hipsRef.current) {
        hipsRef.current.position.y = 0.92 + Math.abs(Math.sin(ph)) * 0.055
        hipsRef.current.rotation.y = Math.sin(ph) * 0.07
      }
      if (torsoRef.current) {
        torsoRef.current.rotation.y = -Math.sin(ph) * 0.05
        torsoRef.current.rotation.x = -0.06
      }
      if (lThighRef.current) lThighRef.current.rotation.x =  Math.sin(ph) * 0.85
      if (rThighRef.current) rThighRef.current.rotation.x = -Math.sin(ph) * 0.85
      if (lShinRef.current)  lShinRef.current.rotation.x  = Math.max(0, -Math.sin(ph) * 1.05)
      if (rShinRef.current)  rShinRef.current.rotation.x  = Math.max(0,  Math.sin(ph) * 1.05)
      if (lUArmRef.current)  lUArmRef.current.rotation.x  = -Math.sin(ph) * 0.6
      if (rUArmRef.current)  rUArmRef.current.rotation.x  =  Math.sin(ph) * 0.6
      if (lFArmRef.current)  lFArmRef.current.rotation.x  = -0.45 + Math.sin(ph) * 0.22
      if (rFArmRef.current)  rFArmRef.current.rotation.x  = -0.45 - Math.sin(ph) * 0.22
    } else {
      // Idle breathing
      const b = t * 1.5
      if (hipsRef.current)  hipsRef.current.position.y = 0.92 + Math.sin(b) * 0.008
      if (torsoRef.current) { torsoRef.current.rotation.x = 0; torsoRef.current.rotation.y = 0 }
      if (lThighRef.current) lThighRef.current.rotation.x = THREE.MathUtils.lerp(lThighRef.current.rotation.x, 0, delta * 8)
      if (rThighRef.current) rThighRef.current.rotation.x = THREE.MathUtils.lerp(rThighRef.current.rotation.x, 0, delta * 8)
      if (lShinRef.current)  lShinRef.current.rotation.x  = THREE.MathUtils.lerp(lShinRef.current.rotation.x, 0, delta * 8)
      if (rShinRef.current)  rShinRef.current.rotation.x  = THREE.MathUtils.lerp(rShinRef.current.rotation.x, 0, delta * 8)
      if (lUArmRef.current)  lUArmRef.current.rotation.x  = THREE.MathUtils.lerp(lUArmRef.current.rotation.x, 0.1, delta * 8)
      if (rUArmRef.current)  rUArmRef.current.rotation.x  = THREE.MathUtils.lerp(rUArmRef.current.rotation.x, 0.1, delta * 8)
    }

    if (headRef.current && isMoving) {
      headRef.current.rotation.x = 0.04 + Math.sin(t * freq * 2) * 0.012
    }
  })

  const SKIN   = '#e8b89a'
  const JERSEY = '#1a3a6a'   // city navy blue
  const SHORTS = '#2a2a3a'   // dark charcoal
  const SHOE   = '#1a1a2a'
  const SOLE   = '#e8e0d0'
  const HAIR   = '#1a0a00'

  return (
    <group ref={rootRef} position={[0, 0, 2]}>
      <group ref={hipsRef} position={[0, 0.92, 0]}>
        {/* Shorts */}
        <mesh>
          <boxGeometry args={[0.38, 0.22, 0.20]} />
          <meshStandardMaterial color={SHORTS} roughness={0.7} />
        </mesh>

        {/* LEFT LEG */}
        <group ref={lThighRef} position={[-0.12, -0.08, 0]}>
          <mesh position={[0, -0.20, 0]}>
            <capsuleGeometry args={[0.082, 0.30, 4, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.55} />
          </mesh>
          <group ref={lShinRef} position={[0, -0.38, 0]}>
            <mesh position={[0, -0.17, 0]}>
              <capsuleGeometry args={[0.068, 0.26, 4, 8]} />
              <meshStandardMaterial color={SKIN} roughness={0.55} />
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.072, 0.068, 0.10, 8]} />
              <meshStandardMaterial color="#e8e8e8" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.42, 0.03]}>
              <boxGeometry args={[0.14, 0.09, 0.28]} />
              <meshStandardMaterial color={SHOE} roughness={0.6} metalness={0.1} />
            </mesh>
            <mesh position={[0, -0.466, 0.03]}>
              <boxGeometry args={[0.16, 0.022, 0.30]} />
              <meshStandardMaterial color={SOLE} roughness={0.5} />
            </mesh>
          </group>
        </group>

        {/* RIGHT LEG */}
        <group ref={rThighRef} position={[0.12, -0.08, 0]}>
          <mesh position={[0, -0.20, 0]}>
            <capsuleGeometry args={[0.082, 0.30, 4, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.55} />
          </mesh>
          <group ref={rShinRef} position={[0, -0.38, 0]}>
            <mesh position={[0, -0.17, 0]}>
              <capsuleGeometry args={[0.068, 0.26, 4, 8]} />
              <meshStandardMaterial color={SKIN} roughness={0.55} />
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.072, 0.068, 0.10, 8]} />
              <meshStandardMaterial color="#e8e8e8" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.42, 0.03]}>
              <boxGeometry args={[0.14, 0.09, 0.28]} />
              <meshStandardMaterial color={SHOE} roughness={0.6} metalness={0.1} />
            </mesh>
            <mesh position={[0, -0.466, 0.03]}>
              <boxGeometry args={[0.16, 0.022, 0.30]} />
              <meshStandardMaterial color={SOLE} roughness={0.5} />
            </mesh>
          </group>
        </group>

        {/* TORSO */}
        <group ref={torsoRef} position={[0, 0.14, 0]}>
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[0.36, 0.18, 0.20]} />
            <meshStandardMaterial color={JERSEY} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.30, 0]}>
            <boxGeometry args={[0.44, 0.25, 0.22]} />
            <meshStandardMaterial color={JERSEY} roughness={0.5} />
          </mesh>
          {/* Suspenders detail */}
          <mesh position={[-0.1, 0.25, 0.115]}>
            <boxGeometry args={[0.06, 0.30, 0.02]} />
            <meshStandardMaterial color={SHORTS} roughness={0.7} />
          </mesh>
          <mesh position={[0.1, 0.25, 0.115]}>
            <boxGeometry args={[0.06, 0.30, 0.02]} />
            <meshStandardMaterial color={SHORTS} roughness={0.7} />
          </mesh>

          {/* LEFT ARM */}
          <group ref={lUArmRef} position={[-0.29, 0.28, 0]}>
            <mesh position={[0, -0.13, 0]}>
              <capsuleGeometry args={[0.062, 0.18, 4, 8]} />
              <meshStandardMaterial color={JERSEY} roughness={0.5} />
            </mesh>
            <group ref={lFArmRef} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.11, 0]}>
                <capsuleGeometry args={[0.052, 0.15, 4, 8]} />
                <meshStandardMaterial color={SKIN} roughness={0.6} />
              </mesh>
              <mesh position={[0, -0.23, 0]}>
                <sphereGeometry args={[0.062, 8, 6]} />
                <meshStandardMaterial color={SKIN} roughness={0.6} />
              </mesh>
            </group>
          </group>

          {/* RIGHT ARM */}
          <group ref={rUArmRef} position={[0.29, 0.28, 0]}>
            <mesh position={[0, -0.13, 0]}>
              <capsuleGeometry args={[0.062, 0.18, 4, 8]} />
              <meshStandardMaterial color={JERSEY} roughness={0.5} />
            </mesh>
            <group ref={rFArmRef} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.11, 0]}>
                <capsuleGeometry args={[0.052, 0.15, 4, 8]} />
                <meshStandardMaterial color={SKIN} roughness={0.6} />
              </mesh>
              <mesh position={[0, -0.23, 0]}>
                <sphereGeometry args={[0.062, 8, 6]} />
                <meshStandardMaterial color={SKIN} roughness={0.6} />
              </mesh>
            </group>
          </group>

          {/* Neck */}
          <mesh position={[0, 0.50, 0]}>
            <cylinderGeometry args={[0.082, 0.092, 0.13, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.6} />
          </mesh>

          {/* HEAD */}
          <group ref={headRef} position={[0, 0.67, 0]}>
            <mesh>
              <sphereGeometry args={[0.185, 16, 12]} />
              <meshStandardMaterial color={SKIN} roughness={0.6} />
            </mesh>
            {/* City cap */}
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.18, 0.2, 0.22, 10]} />
              <meshStandardMaterial color="#1a2a4a" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.06, 0.1]}>
              <cylinderGeometry args={[0.22, 0.22, 0.04, 10]} />
              <meshStandardMaterial color="#1a2a4a" roughness={0.6} />
            </mesh>
            {/* Cap brim */}
            <mesh position={[0, 0.05, 0.06]}>
              <boxGeometry args={[0.32, 0.03, 0.22]} />
              <meshStandardMaterial color="#111a30" roughness={0.6} />
            </mesh>
            {/* Eyes */}
            <mesh position={[-0.063, 0.015, 0.164]}>
              <sphereGeometry args={[0.024, 6, 6]} />
              <meshStandardMaterial color="#1a0a00" />
            </mesh>
            <mesh position={[0.063, 0.015, 0.164]}>
              <sphereGeometry args={[0.024, 6, 6]} />
              <meshStandardMaterial color="#1a0a00" />
            </mesh>
            {/* Smile */}
            <mesh position={[0, -0.03, 0.175]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.04, 0.008, 4, 8, Math.PI]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
          </group>
        </group>
      </group>

      {/* Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  )
}
