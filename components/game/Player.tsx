'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, LANE_X } from '@/store/gameStore'

const JUMP_HEIGHT = 2.2
const JUMP_DURATION = 0.55

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

  const headRef      = useRef<THREE.Group>(null)
  const jumpElapsed  = useRef(0)

  useFrame(({ clock }, delta) => {
    const store = useGameStore.getState()
    const { lane, playerX, isJumping, isStumbling, phase, setPlayerX, setPlayerY, landJump } = store
    if (!rootRef.current) return

    const t = clock.getElapsedTime()
    const isRunning = phase === 'running'

    // Smooth lane transition
    const targetX = LANE_X[lane + 1]
    const newX = THREE.MathUtils.lerp(playerX, targetX, delta * 9)
    setPlayerX(newX)
    rootRef.current.position.x = newX

    // Lean into lane change
    rootRef.current.rotation.z = THREE.MathUtils.lerp(
      rootRef.current.rotation.z,
      (targetX - newX) * -0.3,
      delta * 8
    )

    // Stumble wobble
    if (isStumbling) {
      rootRef.current.rotation.z += Math.sin(t * 25) * 0.04
    }

    // Jump arc
    if (isJumping) {
      jumpElapsed.current += delta
      const progress = jumpElapsed.current / JUMP_DURATION
      if (progress >= 1) {
        jumpElapsed.current = 0
        landJump()
        setPlayerY(0)
        rootRef.current.position.y = 0
      } else {
        const y = Math.sin(progress * Math.PI) * JUMP_HEIGHT
        setPlayerY(y)
        rootRef.current.position.y = y
      }
    } else {
      jumpElapsed.current = 0
      rootRef.current.position.y = 0
    }

    const freq = isStumbling ? 14 : 9

    if (isRunning && !isJumping) {
      const ph = t * freq
      if (hipsRef.current) {
        hipsRef.current.position.y = 0.92 + Math.abs(Math.sin(ph)) * 0.06
        hipsRef.current.rotation.y = Math.sin(ph) * 0.07
      }
      if (torsoRef.current) {
        torsoRef.current.rotation.y = -Math.sin(ph) * 0.05
        torsoRef.current.rotation.x = isStumbling ? 0.3 : -0.06
      }
      if (lThighRef.current) lThighRef.current.rotation.x =  Math.sin(ph) * 0.9
      if (rThighRef.current) rThighRef.current.rotation.x = -Math.sin(ph) * 0.9
      if (lShinRef.current)  lShinRef.current.rotation.x  = Math.max(0, -Math.sin(ph) * 1.1)
      if (rShinRef.current)  rShinRef.current.rotation.x  = Math.max(0,  Math.sin(ph) * 1.1)
      if (lUArmRef.current)  lUArmRef.current.rotation.x  = -Math.sin(ph) * 0.65
      if (rUArmRef.current)  rUArmRef.current.rotation.x  =  Math.sin(ph) * 0.65
      if (lFArmRef.current)  lFArmRef.current.rotation.x  = -0.5 + Math.sin(ph) * 0.25
      if (rFArmRef.current)  rFArmRef.current.rotation.x  = -0.5 - Math.sin(ph) * 0.25
      if (headRef.current)   headRef.current.rotation.x   = 0.04 + Math.sin(ph * 2) * 0.015
    } else if (isJumping) {
      if (hipsRef.current)   hipsRef.current.rotation.y = 0
      if (lThighRef.current) lThighRef.current.rotation.x = -0.75
      if (rThighRef.current) rThighRef.current.rotation.x = -0.75
      if (lShinRef.current)  lShinRef.current.rotation.x  =  1.1
      if (rShinRef.current)  rShinRef.current.rotation.x  =  1.1
      if (lUArmRef.current)  lUArmRef.current.rotation.x  =  0.7
      if (rUArmRef.current)  rUArmRef.current.rotation.x  =  0.7
      if (lFArmRef.current)  lFArmRef.current.rotation.x  = -1.0
      if (rFArmRef.current)  rFArmRef.current.rotation.x  = -1.0
    }
  })

  const SKIN   = '#e8b89a'
  const JERSEY = '#c8102e'
  const SHORTS = '#1a1a2e'
  const SHOE   = '#111111'
  const SOLE   = '#ffffff'
  const HAIR   = '#1a0a00'

  return (
    <group ref={rootRef} position={[0, 0, 0]}>
      {/* HIPS — pivot point for legs + torso */}
      <group ref={hipsRef} position={[0, 0.92, 0]}>

        {/* Shorts */}
        <mesh>
          <boxGeometry args={[0.38, 0.22, 0.20]} />
          <meshStandardMaterial color={SHORTS} roughness={0.6} />
        </mesh>

        {/* ── LEFT LEG ── */}
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
              <meshStandardMaterial color="white" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.42, 0.03]}>
              <boxGeometry args={[0.14, 0.09, 0.28]} />
              <meshStandardMaterial color={SHOE} roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh position={[0, -0.466, 0.03]}>
              <boxGeometry args={[0.16, 0.022, 0.30]} />
              <meshStandardMaterial color={SOLE} roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* ── RIGHT LEG ── */}
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
              <meshStandardMaterial color="white" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.42, 0.03]}>
              <boxGeometry args={[0.14, 0.09, 0.28]} />
              <meshStandardMaterial color={SHOE} roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh position={[0, -0.466, 0.03]}>
              <boxGeometry args={[0.16, 0.022, 0.30]} />
              <meshStandardMaterial color={SOLE} roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* ── TORSO ── */}
        <group ref={torsoRef} position={[0, 0.14, 0]}>
          {/* Lower jersey */}
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[0.36, 0.18, 0.20]} />
            <meshStandardMaterial color={JERSEY} roughness={0.5} />
          </mesh>
          {/* Chest */}
          <mesh position={[0, 0.30, 0]}>
            <boxGeometry args={[0.44, 0.25, 0.22]} />
            <meshStandardMaterial color={JERSEY} roughness={0.5} />
          </mesh>
          {/* Race bib */}
          <mesh position={[0, 0.28, 0.12]}>
            <planeGeometry args={[0.28, 0.20]} />
            <meshStandardMaterial color="white" roughness={0.9} />
          </mesh>

          {/* ── LEFT ARM ── */}
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

          {/* ── RIGHT ARM ── */}
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
            {/* Hair */}
            <mesh position={[0, 0.10, -0.02]}>
              <sphereGeometry args={[0.194, 16, 8]} />
              <meshStandardMaterial color={HAIR} roughness={0.8} />
            </mesh>
            {/* Cap brim */}
            <mesh position={[0, 0.06, 0.18]} rotation={[0.18, 0, 0]}>
              <boxGeometry args={[0.26, 0.04, 0.13]} />
              <meshStandardMaterial color="#c8102e" roughness={0.6} />
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
          </group>
        </group>
      </group>

      {/* Ground shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} depthWrite={false} />
      </mesh>
    </group>
  )
}
