'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function seeded(n: number) {
  const x = Math.sin(n + 17) * 43758.5453
  return x - Math.floor(x)
}

// ─── Terrain ──────────────────────────────────────────────────────────────────

function Ground() {
  return (
    <group>
      {/* Main pasture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -62]} receiveShadow>
        <planeGeometry args={[78, 136]} />
        <meshStandardMaterial color="#3a7d44" roughness={0.95} />
      </mesh>
      {/* Dirt path — vertical */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -56]}>
        <planeGeometry args={[3.6, 120]} />
        <meshStandardMaterial color="#a0784a" roughness={0.98} />
      </mesh>
      {/* Dirt path — horizontal cross (Education ↔ Achievements) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -36]}>
        <planeGeometry args={[50, 3.4]} />
        <meshStandardMaterial color="#a0784a" roughness={0.98} />
      </mesh>
      {/* Dirt path — horizontal cross (Everstage ↔ Chargebee) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -64]}>
        <planeGeometry args={[50, 3.4]} />
        <meshStandardMaterial color="#a0784a" roughness={0.98} />
      </mesh>
      {/* Far ground extension */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -62]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2a6b34" roughness={0.95} />
      </mesh>
    </group>
  )
}

// ─── Fence ────────────────────────────────────────────────────────────────────

function FencePost({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 0.55, z]}>
      <boxGeometry args={[0.14, 1.1, 0.14]} />
      <meshStandardMaterial color="#7a5230" roughness={0.9} />
    </mesh>
  )
}

function FenceLine({ x1, z1, x2, z2 }: { x1: number; z1: number; x2: number; z2: number }) {
  const dx = x2 - x1, dz = z2 - z1
  const len = Math.sqrt(dx * dx + dz * dz)
  const midX = (x1 + x2) / 2, midZ = (z1 + z2) / 2
  const angle = Math.atan2(dx, dz)
  const posts = Math.floor(len / 4)
  return (
    <group>
      {/* Rails */}
      {[0.5, 0.85].map((yFrac, i) => (
        <mesh key={i} position={[midX, yFrac, midZ]} rotation={[0, angle, 0]}>
          <boxGeometry args={[0.08, 0.08, len]} />
          <meshStandardMaterial color="#9a6b40" roughness={0.85} />
        </mesh>
      ))}
      {/* Posts */}
      {Array.from({ length: posts + 1 }).map((_, i) => (
        <FencePost
          key={i}
          x={x1 + (dx / posts) * i}
          z={z1 + (dz / posts) * i}
        />
      ))}
    </group>
  )
}

function PerimeterFence() {
  return (
    <group>
      <FenceLine x1={-36} z1={4}   x2={36}  z2={4}   />
      <FenceLine x1={36}  z1={4}   x2={36}  z2={-126} />
      <FenceLine x1={36}  z1={-126} x2={-36} z2={-126} />
      <FenceLine x1={-36} z1={-126} x2={-36} z2={4}   />
    </group>
  )
}

// ─── Trees ────────────────────────────────────────────────────────────────────

function Tree({ x, z, scale = 1, variant = 0 }: { x: number; z: number; scale?: number; variant?: number }) {
  const trunkColor  = variant === 0 ? '#6b3f1f' : '#5c3a1a'
  const canopyColor = variant === 0 ? '#2d7a2d' : '#3a8a3a'
  const topColor    = variant === 0 ? '#3d9a3d' : '#4aaa4a'
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 2.0, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <sphereGeometry args={[1.45, 8, 6]} />
        <meshStandardMaterial color={canopyColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.85, 8, 6]} />
        <meshStandardMaterial color={topColor} roughness={0.85} />
      </mesh>
    </group>
  )
}

function ScatteredTrees() {
  const positions = [
    [-32, -8],  [-33, -22], [-32, -50], [-32, -75], [-32, -100], [-33, -118],
    [32,  -12], [33,  -28], [32,  -55], [33,  -78], [32,  -105], [33,  -120],
    [-28, -45], [28,  -45], [-28, -82], [28,  -82],
    [-20, -8],  [20, -8],   [-10, -110], [10, -110],
  ]
  return (
    <group>
      {positions.map(([x, z], i) => (
        <Tree key={i} x={x} z={z} scale={0.85 + seeded(i * 7) * 0.35} variant={i % 2} />
      ))}
    </group>
  )
}

// ─── River ────────────────────────────────────────────────────────────────────

function River() {
  const waterRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshStandardMaterial
      mat.roughness = 0.05 + Math.abs(Math.sin(clock.getElapsedTime() * 0.4)) * 0.08
    }
  })
  return (
    <group>
      {/* Banks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -47]}>
        <planeGeometry args={[78, 1.8]} />
        <meshStandardMaterial color="#7a5a30" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -53]}>
        <planeGeometry args={[78, 1.8]} />
        <meshStandardMaterial color="#7a5a30" roughness={0.9} />
      </mesh>
      {/* Water */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, -50]}>
        <planeGeometry args={[78, 6]} />
        <meshStandardMaterial color="#3a90d0" roughness={0.08} metalness={0.18} transparent opacity={0.88} />
      </mesh>
      {/* Ripple strips */}
      {[-3, -1, 1, 3].map((dz, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[seeded(i * 3) * 30 - 15, 0.07, -50 + dz]}>
          <planeGeometry args={[8 + seeded(i) * 12, 0.12]} />
          <meshStandardMaterial color="#88ccee" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Bridge ───────────────────────────────────────────────────────────────────

function Bridge() {
  return (
    <group position={[0, 0.12, -50]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 0.22, 6.4]} />
        <meshStandardMaterial color="#8b6535" roughness={0.88} />
      </mesh>
      {/* Planks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 0.12, -2.8 + i * 0.8]}>
          <boxGeometry args={[4.2, 0.06, 0.55]} />
          <meshStandardMaterial color="#a07840" roughness={0.9} />
        </mesh>
      ))}
      {/* Railings */}
      {[-1.85, 1.85].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.55, 0]}>
            <boxGeometry args={[0.1, 0.7, 6.5]} />
            <meshStandardMaterial color="#6b4a20" roughness={0.88} />
          </mesh>
          {[-2.5, 0, 2.5].map((z, j) => (
            <mesh key={j} position={[x, 0.65, z]}>
              <boxGeometry args={[0.14, 0.9, 0.14]} />
              <meshStandardMaterial color="#5c3a10" roughness={0.88} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// ─── Hay Bales ────────────────────────────────────────────────────────────────

function HayBale({ x, z, rotY = 0 }: { x: number; z: number; rotY?: number }) {
  return (
    <mesh position={[x, 0.38, z]} rotation={[Math.PI / 2, rotY, 0]}>
      <cylinderGeometry args={[0.4, 0.4, 0.75, 12]} />
      <meshStandardMaterial color="#d4a843" roughness={0.9} />
    </mesh>
  )
}

// ─── Building helpers ─────────────────────────────────────────────────────────

function GableRoof({ w, h, d, color, cx = 0, by = 0, cz = 0 }: {
  w: number; h: number; d: number; color: string; cx?: number; by?: number; cz?: number
}) {
  const slope = Math.sqrt((w / 2) ** 2 + h ** 2)
  const angle = Math.atan2(h, w / 2)
  return (
    <group position={[cx, by, cz]}>
      <mesh position={[-w / 4, h / 2, 0]} rotation={[0, 0, -angle]}>
        <boxGeometry args={[slope + 0.2, 0.18, d + 0.2]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[w / 4, h / 2, 0]} rotation={[0, 0, angle]}>
        <boxGeometry args={[slope + 0.2, 0.18, d + 0.2]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[0.25, 0.2, d + 0.3]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
}

// ─── Zone 1: Welcome / Hello ───────────────────────────────────────────────────

function WelcomeZone() {
  const cx = 0, cz = -12
  return (
    <group>
      {/* Welcome arch */}
      {[-3.5, 3.5].map((x, i) => (
        <mesh key={i} position={[cx + x, 2.5, cz]}>
          <cylinderGeometry args={[0.22, 0.28, 5, 10]} />
          <meshStandardMaterial color="#c17f24" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[cx, 5.1, cz]}>
        <boxGeometry args={[7.2, 0.42, 0.42]} />
        <meshStandardMaterial color="#c17f24" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Welcome sign */}
      <mesh position={[cx, 4.2, cz + 0.3]}>
        <boxGeometry args={[5, 0.9, 0.12]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.6} />
      </mesh>
      <Html position={[cx, 4.18, cz + 0.42]} center distanceFactor={10}>
        <div style={{ color: '#f5f0e8', fontFamily: 'serif', fontSize: '11px', fontWeight: 900, letterSpacing: '0.15em', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          AKASH'S FARM
        </div>
      </Html>
      {/* Flower beds */}
      {[[-2.5, 1.5], [2.5, 1.5], [-2.5, -1.5], [2.5, -1.5]].map(([fx, fz], i) => (
        <group key={i}>
          <mesh position={[cx + fx, 0.05, cz + fz]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.7, 8]} />
            <meshStandardMaterial color="#5a8a30" roughness={0.9} />
          </mesh>
          {Array.from({ length: 5 }).map((_, j) => {
            const angle = (j / 5) * Math.PI * 2
            return (
              <group key={j}>
                <mesh position={[cx + fx + Math.cos(angle) * 0.4, 0.22, cz + fz + Math.sin(angle) * 0.4]}>
                  <cylinderGeometry args={[0.03, 0.04, 0.44, 5]} />
                  <meshStandardMaterial color="#3a7a20" roughness={0.9} />
                </mesh>
                <mesh position={[cx + fx + Math.cos(angle) * 0.4, 0.5, cz + fz + Math.sin(angle) * 0.4]}>
                  <sphereGeometry args={[0.1, 6, 5]} />
                  <meshStandardMaterial color={['#ff6b8a', '#ffdd44', '#ff8844', '#cc44ff', '#44aaff'][j]} roughness={0.7} />
                </mesh>
              </group>
            )
          })}
        </group>
      ))}
      {/* Mailbox post */}
      <mesh position={[cx - 5, 0.5, cz]}>
        <cylinderGeometry args={[0.06, 0.08, 1.0, 6]} />
        <meshStandardMaterial color="#5c3a10" roughness={0.85} />
      </mesh>
      <mesh position={[cx - 5, 1.2, cz]}>
        <boxGeometry args={[0.4, 0.35, 0.55]} />
        <meshStandardMaterial color="#c8102e" roughness={0.5} />
      </mesh>
    </group>
  )
}

// ─── Zone 2: Education / Schoolhouse ──────────────────────────────────────────

function Schoolhouse() {
  const cx = -22, cz = -36
  const W = 6, H = 3.6, D = 7
  return (
    <group position={[cx, 0, cz]}>
      {/* Walls */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#e8e0c8" roughness={0.7} />
      </mesh>
      {/* Roof */}
      <GableRoof w={W} h={1.8} d={D} color="#8b4513" by={H} />
      {/* Bell tower */}
      <mesh position={[0, H + 2.5, 0]}>
        <boxGeometry args={[1.2, 2.0, 1.2]} />
        <meshStandardMaterial color="#d8d0b8" roughness={0.7} />
      </mesh>
      <GableRoof w={1.2} h={0.8} d={1.2} color="#7a3810" by={H + 3.5} />
      {/* Bell */}
      <mesh position={[0, H + 2.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.35, 8]} />
        <meshStandardMaterial color="#c8a830" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Door */}
      <mesh position={[0, H * 0.37, D / 2 + 0.02]}>
        <boxGeometry args={[1.1, H * 0.72, 0.08]} />
        <meshStandardMaterial color="#5c3317" roughness={0.85} />
      </mesh>
      {/* Windows */}
      {[-1.8, 1.8].map((wx, i) => (
        <mesh key={i} position={[wx, H * 0.55, D / 2 + 0.02]}>
          <boxGeometry args={[0.9, 0.8, 0.06]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} roughness={0.1} metalness={0.1} />
        </mesh>
      ))}
      {/* Chalkboard sign */}
      <mesh position={[0, 1.5, -D / 2 - 0.02]}>
        <boxGeometry args={[2.8, 1.2, 0.08]} />
        <meshStandardMaterial color="#1a3a1a" roughness={0.8} />
      </mesh>
      <Html position={[0, 1.5, -D / 2 - 0.12]} center distanceFactor={10}>
        <div style={{ color: '#c8f0c8', fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          EDUCATION
        </div>
      </Html>
      {/* Steps */}
      <mesh position={[0, 0.1, D / 2 + 0.7]}>
        <boxGeometry args={[1.6, 0.2, 1.2]} />
        <meshStandardMaterial color="#c8c0a8" roughness={0.8} />
      </mesh>
      {/* Books scattered */}
      {[[1.5, 0.08, 2.5, '#c8102e'], [-2, 0.05, 3, '#0057a8'], [2, 0.05, -2.5, '#2d7a2d']].map(([bx, by, bz, bc], i) => (
        <mesh key={i} position={[bx as number, by as number, bz as number]} rotation={[0, (seeded(i) - 0.5) * 0.8, 0]}>
          <boxGeometry args={[0.28, 0.08, 0.38]} />
          <meshStandardMaterial color={bc as string} roughness={0.7} />
        </mesh>
      ))}
      <HayBale x={-3.5} z={3} />
    </group>
  )
}

// ─── Zone 3: Achievements / Trophy Barn ───────────────────────────────────────

function TrophyBarn() {
  const cx = 22, cz = -36
  const W = 7, H = 4, D = 9
  return (
    <group position={[cx, 0, cz]}>
      {/* Barn body */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#8b1a1a" roughness={0.8} />
      </mesh>
      {/* White trim boards */}
      {[-W / 2 + 0.1, W / 2 - 0.1].map((x, i) => (
        <mesh key={i} position={[x, H / 2, 0]}>
          <boxGeometry args={[0.18, H + 0.1, D + 0.1]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.7} />
        </mesh>
      ))}
      <GableRoof w={W} h={2.2} d={D} color="#5c0f0f" by={H} />
      {/* Big doors */}
      {[-1.4, 1.4].map((x, i) => (
        <mesh key={i} position={[x, H * 0.42, D / 2 + 0.04]}>
          <boxGeometry args={[1.4, H * 0.84, 0.1]} />
          <meshStandardMaterial color="#3d0b0b" roughness={0.85} />
        </mesh>
      ))}
      {/* Star decoration */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.9, H - 0.5 + Math.sin(a) * 0.9, D / 2 + 0.06]}>
            <boxGeometry args={[0.18, 0.18, 0.05]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.4} roughness={0.4} />
          </mesh>
        )
      })}
      {/* Trophy */}
      <mesh position={[0, H - 0.4, D / 2 + 0.08]}>
        <cylinderGeometry args={[0.35, 0.22, 0.55, 8]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.3} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, H + 0.12, D / 2 + 0.08]}>
        <sphereGeometry args={[0.22, 8, 6]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.3} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Hay bales */}
      <HayBale x={4.5} z={3} />
      <HayBale x={4.5} z={4.5} rotY={0.3} />
      <HayBale x={-4.5} z={-3} />
    </group>
  )
}

// ─── Zone 4: Everstage / Crop Field ───────────────────────────────────────────

function CropPlant({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.3, 5]} />
        <meshStandardMaterial color="#4a7c3f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.38, 0]}>
        <cylinderGeometry args={[0.09, 0.03, 0.42, 5]} />
        <meshStandardMaterial color="#c8a020" roughness={0.85} />
      </mesh>
      <mesh position={[-0.16, 0.72, 0]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.3, 0.05, 0.08]} />
        <meshStandardMaterial color="#4a8030" roughness={0.9} />
      </mesh>
      <mesh position={[0.16, 0.85, 0]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.3, 0.05, 0.08]} />
        <meshStandardMaterial color="#4a8030" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Scarecrow({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 2.6, 6]} />
        <meshStandardMaterial color="#8b6914" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <boxGeometry args={[1.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#8b6914" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.42, 0.55, 0.2]} />
        <meshStandardMaterial color="#c4a35a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.62, 0]}>
        <sphereGeometry args={[0.24, 8, 6]} />
        <meshStandardMaterial color="#f5deb3" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.86, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.36, 8]} />
        <meshStandardMaterial color="#4a2c00" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.68, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 8]} />
        <meshStandardMaterial color="#4a2c00" roughness={0.8} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.72, 1.9, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.04, 0.55, 4, 6]} />
        <meshStandardMaterial color="#c4a35a" roughness={0.9} />
      </mesh>
      <mesh position={[0.72, 1.9, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.04, 0.55, 4, 6]} />
        <meshStandardMaterial color="#c4a35a" roughness={0.9} />
      </mesh>
    </group>
  )
}

function CropField() {
  const cx = -22, cz = -64
  const rows = 5, cols = 8
  const spacing = 1.3
  return (
    <group position={[cx, 0, cz]}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <CropPlant
            key={`${r}-${c}`}
            x={(c - cols / 2) * spacing + 0.3}
            z={(r - rows / 2) * spacing}
          />
        ))
      )}
      <Scarecrow x={5} z={0} />
      {/* Irrigation pipe */}
      <mesh position={[0, 0.25, -4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 10, 6]} />
        <meshStandardMaterial color="#a0a0a0" roughness={0.5} metalness={0.4} />
      </mesh>
    </group>
  )
}

// ─── Zone 5: Chargebee / Orchard + Barn ───────────────────────────────────────

function OrchardTree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.14, 0.2, 2.0, 7]} />
        <meshStandardMaterial color="#5c3317" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshStandardMaterial color="#2d7a2d" roughness={0.85} />
      </mesh>
      {/* Apples */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.8, 2.6 + (i % 2) * 0.3, Math.sin(a) * 0.8]}>
            <sphereGeometry args={[0.1, 6, 5]} />
            <meshStandardMaterial color="#cc2200" emissive="#440000" emissiveIntensity={0.15} roughness={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

function StorageShed() {
  const W = 4, H = 2.8, D = 5
  return (
    <group>
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#a03000" roughness={0.8} />
      </mesh>
      <GableRoof w={W} h={1.2} d={D} color="#7a2000" by={H} />
      <mesh position={[0, H * 0.38, D / 2 + 0.04]}>
        <boxGeometry args={[1.2, H * 0.72, 0.1]} />
        <meshStandardMaterial color="#3d1500" roughness={0.85} />
      </mesh>
      {/* Fruit crates */}
      {[[-1.5, 3.5], [0.5, 3.5], [1.8, 3.2]].map(([cx, cz], i) => (
        <mesh key={i} position={[cx, 0.25, cz]}>
          <boxGeometry args={[0.6, 0.48, 0.6]} />
          <meshStandardMaterial color="#8b5e3c" roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

function Orchard() {
  const cx = 22, cz = -64
  const positions = [[-5, -4], [-2.5, -4], [0, -4], [2.5, -4], [5, -4],
                     [-5,  0], [-2.5,  0],            [2.5,  0], [5,  0],
                     [-5,  4], [-2.5,  4], [0,  4], [2.5,  4], [5,  4]]
  return (
    <group position={[cx, 0, cz]}>
      {positions.map(([tx, tz], i) => (
        <OrchardTree key={i} x={tx} z={tz} />
      ))}
      <group position={[0, 0, 8]}>
        <StorageShed />
      </group>
    </group>
  )
}

// ─── Zone 6: Skills / Workshop ────────────────────────────────────────────────

function Workshop() {
  const cx = 0, cz = -90
  const W = 7, H = 3.2, D = 8
  return (
    <group position={[cx, 0, cz]}>
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#5a4a2a" roughness={0.75} />
      </mesh>
      <GableRoof w={W} h={1.6} d={D} color="#3a2a10" by={H} />
      {/* Large workshop door */}
      <mesh position={[0, H * 0.42, D / 2 + 0.04]}>
        <boxGeometry args={[2.2, H * 0.82, 0.1]} />
        <meshStandardMaterial color="#3a2a10" roughness={0.9} />
      </mesh>
      {/* Windows */}
      {[-2.2, 2.2].map((wx, i) => (
        <mesh key={i} position={[wx, H * 0.6, D / 2 + 0.04]}>
          <boxGeometry args={[1.0, 0.85, 0.06]} />
          <meshStandardMaterial color="#ffee88" transparent opacity={0.6} emissive="#ffcc44" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* Gear decorations */}
      {[[-4, 1.2], [4, 1.2], [-4, 2.5], [4, 2.5]].map(([gx, gy], i) => (
        <mesh key={i} position={[gx, gy, -D / 2 - 0.08]}>
          <torusGeometry args={[0.38, 0.1, 6, 12]} />
          <meshStandardMaterial color="#c0a030" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
      {/* Tool rack outside */}
      <mesh position={[4.2, 1.0, 0]}>
        <boxGeometry args={[0.12, 2.0, 3.5]} />
        <meshStandardMaterial color="#6b4a20" roughness={0.9} />
      </mesh>
      {[[-1, '#cc2200'], [0, '#4466aa'], [1, '#228844']].map(([dz, col], i) => (
        <mesh key={i} position={[4.5, 1.1, dz as number]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.04, 0.05, 1.8, 6]} />
          <meshStandardMaterial color={col as string} roughness={0.6} />
        </mesh>
      ))}
      {/* Work bench */}
      <mesh position={[-3, 0.55, 3.5]}>
        <boxGeometry args={[2.2, 0.1, 0.9]} />
        <meshStandardMaterial color="#8b6535" roughness={0.85} />
      </mesh>
      <mesh position={[-3, 0.3, 3.5]}>
        <boxGeometry args={[0.1, 0.5, 0.9]} />
        <meshStandardMaterial color="#6b4a20" roughness={0.85} />
      </mesh>
    </group>
  )
}

// ─── Zone 7: Connect / Farmhouse ─────────────────────────────────────────────

function Farmhouse() {
  const cx = 0, cz = -114
  const W = 6.5, H = 3.8, D = 7.5
  return (
    <group position={[cx, 0, cz]}>
      {/* Main house */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#f0e8d0" roughness={0.65} />
      </mesh>
      <GableRoof w={W} h={2.0} d={D} color="#8b4513" by={H} />
      {/* Chimney */}
      <mesh position={[1.8, H + 1.6, -1.5]}>
        <boxGeometry args={[0.5, 2.6, 0.5]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      <mesh position={[1.8, H + 2.85, -1.5]}>
        <boxGeometry args={[0.62, 0.18, 0.62]} />
        <meshStandardMaterial color="#6b3310" roughness={0.8} />
      </mesh>
      {/* Door */}
      <mesh position={[0, H * 0.38, D / 2 + 0.04]}>
        <boxGeometry args={[1.1, H * 0.72, 0.08]} />
        <meshStandardMaterial color="#5c3317" roughness={0.8} />
      </mesh>
      {/* Door window */}
      <mesh position={[0, H * 0.58, D / 2 + 0.09]}>
        <boxGeometry args={[0.5, 0.4, 0.04]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} roughness={0.1} />
      </mesh>
      {/* Windows */}
      {[-2.0, 2.0].map((wx, i) => (
        <group key={i}>
          <mesh position={[wx, H * 0.58, D / 2 + 0.04]}>
            <boxGeometry args={[0.95, 0.85, 0.06]} />
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.72} roughness={0.1} emissive="#ffffdd" emissiveIntensity={0.08} />
          </mesh>
          {/* Window shutters */}
          {[-0.58, 0.58].map((sx, j) => (
            <mesh key={j} position={[wx + sx, H * 0.58, D / 2 + 0.06]}>
              <boxGeometry args={[0.22, 0.85, 0.05]} />
              <meshStandardMaterial color="#8b4513" roughness={0.75} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Porch */}
      <mesh position={[0, 0.1, D / 2 + 1.2]}>
        <boxGeometry args={[W, 0.2, 2.2]} />
        <meshStandardMaterial color="#c8a870" roughness={0.85} />
      </mesh>
      {[-2.8, 0, 2.8].map((px, i) => (
        <mesh key={i} position={[px, 1.2, D / 2 + 2.1]}>
          <cylinderGeometry args={[0.1, 0.1, 2.2, 8]} />
          <meshStandardMaterial color="#d8c090" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 2.35, D / 2 + 2.1]}>
        <boxGeometry args={[W, 0.15, 0.15]} />
        <meshStandardMaterial color="#c8a870" roughness={0.7} />
      </mesh>
      {/* Garden */}
      <mesh position={[-5.5, 0.04, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 10]} />
        <meshStandardMaterial color="#4a8030" roughness={0.95} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[-5.5 + Math.cos(a) * 1.5, 0.38, 2 + Math.sin(a) * 1.5]}>
            <sphereGeometry args={[0.14, 6, 5]} />
            <meshStandardMaterial color={['#ff6b8a', '#ffdd44', '#cc44ff', '#ff8844'][i % 4]} roughness={0.6} />
          </mesh>
        )
      })}
      {/* Well */}
      <group position={[5.5, 0, 3]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 1.0, 12]} />
          <meshStandardMaterial color="#9a7a50" roughness={0.9} />
        </mesh>
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 1.5, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 1.4, 7]} />
            <meshStandardMaterial color="#6b4a20" roughness={0.85} />
          </mesh>
        ))}
        <mesh position={[0, 2.1, 0]}>
          <boxGeometry args={[1.4, 0.12, 0.5]} />
          <meshStandardMaterial color="#7a5030" roughness={0.85} />
        </mesh>
      </group>
      {/* Point light inside to look warm */}
      <pointLight position={[0, 2, 0]} color="#ffe8aa" intensity={2} distance={12} />
    </group>
  )
}

// ─── Cattle Pen ───────────────────────────────────────────────────────────────

function Cow({ x, z, rotY = 0 }: { x: number; z: number; rotY?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.75, 0.65, 1.4]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.9} />
      </mesh>
      {/* Spots */}
      <mesh position={[0.28, 0.88, 0.2]}>
        <boxGeometry args={[0.3, 0.38, 0.5]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.88, 0.82]}>
        <boxGeometry args={[0.46, 0.44, 0.52]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.76, 1.08]}>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshStandardMaterial color="#f0b0b0" roughness={0.8} />
      </mesh>
      {/* Ears */}
      {[-0.28, 0.28].map((ex, i) => (
        <mesh key={i} position={[ex, 1.1, 0.75]}>
          <boxGeometry args={[0.1, 0.12, 0.08]} />
          <meshStandardMaterial color="#f0ece0" roughness={0.9} />
        </mesh>
      ))}
      {/* Legs */}
      {[[-0.22, -0.44], [0.22, -0.44], [-0.22, 0.44], [0.22, 0.44]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.24, lz]}>
          <boxGeometry args={[0.15, 0.48, 0.15]} />
          <meshStandardMaterial color="#e8e0d0" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function CattlePen() {
  return (
    <group position={[10, 0, -55]}>
      {/* Pen fence */}
      <FenceLine x1={-6} z1={-5} x2={6} z2={-5} />
      <FenceLine x1={6}  z1={-5} x2={6} z2={5}  />
      <FenceLine x1={6}  z1={5}  x2={-6} z2={5} />
      <FenceLine x1={-6} z1={5}  x2={-6} z2={-5}/>
      {/* Mud patch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[11, 9.5]} />
        <meshStandardMaterial color="#7a5030" roughness={0.97} />
      </mesh>
      <Cow x={-2} z={-2} rotY={0.4} />
      <Cow x={2}  z={0}  rotY={2.1} />
      <Cow x={-1} z={2}  rotY={-0.8} />
      {/* Trough */}
      <mesh position={[0, 0.2, -3.5]}>
        <boxGeometry args={[3.5, 0.4, 0.7]} />
        <meshStandardMaterial color="#6b4a20" roughness={0.88} />
      </mesh>
    </group>
  )
}

// ─── Zone Markers (proximity indicators) ─────────────────────────────────────

function ZoneMarker({ milestone, index, seenMilestones }: {
  milestone: typeof milestones[0]
  index: number
  seenMilestones: number[]
}) {
  const visited = seenMilestones.includes(index)
  const glowRef = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (glowRef.current && !visited) {
      glowRef.current.intensity = 1.2 + Math.sin(clock.getElapsedTime() * 2.5) * 0.6
    }
  })
  return (
    <group position={[milestone.zoneX, 0, milestone.zoneZ - milestone.zoneRadius + 1]}>
      {/* Sign post */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 2.2, 7]} />
        <meshStandardMaterial color="#6b4a20" roughness={0.85} />
      </mesh>
      {/* Sign board */}
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[2.2, 0.75, 0.14]} />
        <meshStandardMaterial
          color={visited ? '#3a5a3a' : milestone.color + 'cc'}
          emissive={visited ? '#000' : milestone.color}
          emissiveIntensity={visited ? 0 : 0.25}
          roughness={0.5}
        />
      </mesh>
      <Html position={[0, 2.4, 0.1]} center distanceFactor={12}>
        <div style={{
          color: visited ? '#aaa' : '#fff',
          fontFamily: 'serif',
          fontSize: '9px',
          fontWeight: 900,
          letterSpacing: '0.12em',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          pointerEvents: 'none',
          textShadow: visited ? 'none' : `0 0 8px ${milestone.color}`,
        }}>
          {visited ? '✓ ' : ''}{milestone.label.replace('— ', '')}
        </div>
      </Html>
      {!visited && (
        <pointLight ref={glowRef} position={[0, 2, 0.5]} color={milestone.color} intensity={1.5} distance={10} />
      )}
    </group>
  )
}

// ─── Running Track ────────────────────────────────────────────────────────────

function RunningTrack() {
  const cx = -26, cz = -21
  const TW = 10, TH = 14  // track dimensions (inner)
  const LW = 1.3           // lane width × 3 lanes
  const r  = TH / 2

  return (
    <group position={[cx, 0, cz]}>
      {/* Outer surface (orange polyurethane) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[TW + LW * 2 + 1, TH + LW * 2 + 1]} />
        <meshStandardMaterial color="#c84b11" roughness={0.85} />
      </mesh>
      {/* Inner grass infield */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[TW, TH]} />
        <meshStandardMaterial color="#3a8030" roughness={0.9} />
      </mesh>
      {/* Lane dividers */}
      {[0, 1, 2, 3].map(l => (
        <mesh key={l} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <ringGeometry args={[TW / 2 + l * LW, TW / 2 + l * LW + 0.06, 32]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
      {/* Start/finish line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, TH / 2 + LW * 0.5]}>
        <planeGeometry args={[TW / 2 + LW * 3, 0.18]} />
        <meshBasicMaterial color="white" />
      </mesh>
      {/* Starting blocks */}
      {[-1.0, 0, 1.0].map((lx, i) => (
        <mesh key={i} position={[lx * (TW / 8), 0.12, TH / 2 + LW * 1.8]}>
          <boxGeometry args={[0.3, 0.24, 0.35]} />
          <meshStandardMaterial color="#cc0000" roughness={0.5} />
        </mesh>
      ))}
      {/* "TRACK" sign */}
      <mesh position={[0, 1.2, TH / 2 + LW * 2.5 + 0.5]}>
        <boxGeometry args={[2.2, 0.55, 0.12]} />
        <meshStandardMaterial color="#c84b11" roughness={0.5} />
      </mesh>
      <Html position={[0, 1.2, TH / 2 + LW * 2.5 + 0.65]} center distanceFactor={10}>
        <div style={{ color: 'white', fontFamily: 'monospace', fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', pointerEvents: 'none' }}>
          RUNNING
        </div>
      </Html>
      {/* Pole/flag */}
      <mesh position={[TW / 2 + LW * 3.5, 1.5, TH / 2 + LW * 2.5]}>
        <cylinderGeometry args={[0.04, 0.06, 3.0, 6]} />
        <meshStandardMaterial color="#888" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[TW / 2 + LW * 3.5 + 0.4, 2.7, TH / 2 + LW * 2.5]}>
        <planeGeometry args={[0.8, 0.5]} />
        <meshStandardMaterial color="#c84b11" side={THREE.DoubleSide} roughness={0.6} />
      </mesh>
    </group>
  )
}

// ─── Badminton Court ──────────────────────────────────────────────────────────

function BadmintonCourt() {
  const cx = 26, cz = -24
  const CW = 6.1, CL = 13.4

  return (
    <group position={[cx, 0, cz]}>
      {/* Court surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[CW + 1, CL + 1]} />
        <meshStandardMaterial color="#4a8030" roughness={0.85} />
      </mesh>
      {/* Court lines */}
      {/* Outer boundary */}
      {[[-CW / 2, 0], [CW / 2, 0]].map(([lx], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[lx, 0.03, 0]}>
          <planeGeometry args={[0.06, CL]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
      {[[-CL / 2, 0], [CL / 2, 0]].map(([lz], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, lz]}>
          <planeGeometry args={[CW, 0.06]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[CW, 0.06]} />
        <meshBasicMaterial color="white" />
      </mesh>
      {/* Service lines */}
      {[-CL * 0.3, CL * 0.3].map((sz, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, sz]}>
          <planeGeometry args={[CW, 0.05]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
      {/* Net posts */}
      {[-CW / 2 - 0.3, CW / 2 + 0.3].map((px, i) => (
        <mesh key={i} position={[px, 0.78, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 1.55, 6]} />
          <meshStandardMaterial color="#888" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {/* Net */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[CW + 0.6, 0.02, 0.02]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Net mesh visual */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[(i - 4.5) * 0.7, 0.6, 0]}>
          <boxGeometry args={[0.02, 1.0, 0.02]} />
          <meshStandardMaterial color="white" transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Sign */}
      <mesh position={[0, 1.5, CL / 2 + 1]}>
        <boxGeometry args={[2.8, 0.55, 0.12]} />
        <meshStandardMaterial color="#2d7a2d" roughness={0.5} />
      </mesh>
      <Html position={[0, 1.5, CL / 2 + 1.1]} center distanceFactor={10}>
        <div style={{ color: '#f0ffe0', fontFamily: 'monospace', fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', pointerEvents: 'none' }}>
          BADMINTON
        </div>
      </Html>
      {/* Shuttlecocks (decoration) */}
      {[[-2, 0, 3], [1.5, 0, -4]].map(([sx, sy, sz], i) => (
        <mesh key={i} position={[sx, 0.15, sz]}>
          <coneGeometry args={[0.1, 0.22, 8]} />
          <meshStandardMaterial color="#fffde0" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Hobbies label ────────────────────────────────────────────────────────────

function HobbiesArea() {
  return (
    <group>
      <RunningTrack />
      <BadmintonCourt />
      {/* Hobby area banner */}
      <mesh position={[0, 2.0, -3]}>
        <boxGeometry args={[5.5, 0.7, 0.14]} />
        <meshStandardMaterial color="#1a3a1a" roughness={0.6} />
      </mesh>
      <Html position={[0, 2.0, -2.9]} center distanceFactor={12}>
        <div style={{ color: '#8aca44', fontFamily: 'serif', fontSize: '10px', fontWeight: 900, letterSpacing: '0.18em', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          🏃 SPORTS & HOBBIES
        </div>
      </Html>
      <mesh position={[-2.5, 1.0, -3]}>
        <cylinderGeometry args={[0.07, 0.09, 2.0, 6]} />
        <meshStandardMaterial color="#5c3a10" roughness={0.85} />
      </mesh>
      <mesh position={[2.5, 1.0, -3]}>
        <cylinderGeometry args={[0.07, 0.09, 2.0, 6]} />
        <meshStandardMaterial color="#5c3a10" roughness={0.85} />
      </mesh>
    </group>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function Farm() {
  const seenMilestones = useGameStore(s => s.seenMilestones)
  return (
    <group>
      <Ground />
      <PerimeterFence />
      <ScatteredTrees />
      <River />
      <Bridge />
      <CattlePen />

      <WelcomeZone />
      <Schoolhouse />
      <TrophyBarn />
      <CropField />
      <Orchard />
      <Workshop />
      <Farmhouse />
      <HobbiesArea />

      {milestones.map((m, i) => (
        <ZoneMarker key={m.id} milestone={m} index={i} seenMilestones={seenMilestones} />
      ))}
    </group>
  )
}
