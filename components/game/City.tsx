'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'
import { milestones } from '@/lib/gameData'

function seeded(n: number) {
  const x = Math.sin(n + 17) * 43758.5453
  return x - Math.floor(x)
}

// ─── Ground & Roads ───────────────────────────────────────────────────────────

function CityGround() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -62]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -62]}>
        <planeGeometry args={[78, 136]} />
        <meshStandardMaterial color="#383838" roughness={0.9} />
      </mesh>
      {/* Main N-S road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -62]}>
        <planeGeometry args={[8, 136]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.88} />
      </mesh>
      {/* Cross road z=-36 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -36]}>
        <planeGeometry args={[78, 7]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.88} />
      </mesh>
      {/* Cross road z=-64 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -64]}>
        <planeGeometry args={[78, 7]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.88} />
      </mesh>
      {/* Sidewalks */}
      {([-5.8, 5.8] as number[]).map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.015, -62]}>
          <planeGeometry args={[1.8, 136]} />
          <meshStandardMaterial color="#8a8070" roughness={0.82} />
        </mesh>
      ))}
      {/* Left block */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.015, -62]}>
        <planeGeometry args={[22, 136]} />
        <meshStandardMaterial color="#505050" roughness={0.88} />
      </mesh>
      {/* Right block */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[22, 0.015, -62]}>
        <planeGeometry args={[22, 136]} />
        <meshStandardMaterial color="#505050" roughness={0.88} />
      </mesh>
      {/* Road center dashes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -5 - i * 7]}>
          <planeGeometry args={[0.18, 3.5]} />
          <meshStandardMaterial color="#f0c820" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Streetlight ──────────────────────────────────────────────────────────────

function Streetlight({ x, z, side = 1 }: { x: number; z: number; side?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 5, 8]} />
        <meshStandardMaterial color="#555566" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[side * 0.55, 4.9, 0]} rotation={[0, 0, -side * 0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 1.3, 6]} />
        <meshStandardMaterial color="#555566" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[side * 1.0, 4.85, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.4]} />
        <meshStandardMaterial color="#333344" roughness={0.3} metalness={0.8} />
      </mesh>
      <pointLight position={[side * 1.0, 4.65, 0]} color="#ffe8aa" intensity={1.8} distance={15} />
    </group>
  )
}

function StreetlightRow() {
  const lights: [number, number, number][] = [
    [-6.5, -8, -1], [-6.5, -25, -1], [-6.5, -44, -1], [-6.5, -58, -1], [-6.5, -78, -1], [-6.5, -96, -1], [-6.5, -112, -1],
    [6.5,  -8,  1], [6.5,  -25,  1], [6.5,  -44,  1], [6.5,  -58,  1], [6.5,  -78,  1], [6.5,  -96,  1], [6.5, -112,  1],
  ]
  return (
    <group>
      {lights.map(([x, z, side], i) => <Streetlight key={i} x={x} z={z} side={side} />)}
    </group>
  )
}

// ─── Urban Trees ─────────────────────────────────────────────────────────────

function UrbanTree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 2.4, 7]} />
        <meshStandardMaterial color="#3a2a10" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <sphereGeometry args={[1.1, 8, 6]} />
        <meshStandardMaterial color="#2d7a2d" roughness={0.8} />
      </mesh>
    </group>
  )
}

function UrbanTrees() {
  const positions: [number, number][] = [
    [-7.2, -8], [-7.2, -18], [-7.2, -30], [-7.2, -44], [-7.2, -56], [-7.2, -75], [-7.2, -88], [-7.2, -100], [-7.2, -112],
    [7.2,  -8], [7.2,  -18], [7.2,  -30], [7.2,  -44], [7.2,  -56], [7.2,  -75], [7.2,  -88], [7.2,  -100], [7.2,  -112],
  ]
  return (
    <group>
      {positions.map(([x, z], i) => <UrbanTree key={i} x={x} z={z} />)}
    </group>
  )
}

// ─── Background Skyline ───────────────────────────────────────────────────────

function Skyscraper({ x, z, w, h, d, color }: { x: number; z: number; w: number; h: number; d: number; color: string }) {
  const floors = Math.max(1, Math.floor(h / 2))
  const cols = Math.max(1, Math.floor(w / 1.8))
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {Array.from({ length: Math.min(floors, 8) }).map((_, f) =>
        Array.from({ length: Math.min(cols, 4) }).map((_, c) => (
          <mesh key={`${f}-${c}`} position={[
            cols > 1 ? (c - (cols - 1) / 2) * (w / cols) : 0,
            1.0 + f * 2.0,
            d / 2 + 0.05,
          ]}>
            <boxGeometry args={[0.6, 1.0, 0.06]} />
            <meshStandardMaterial
              color="#88bbdd"
              emissive="#2266aa"
              emissiveIntensity={seeded(f * 5 + c * 3 + Math.abs(x)) > 0.5 ? 0.4 : 0.05}
              roughness={0.05}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))
      )}
    </group>
  )
}

function BackgroundSkyline() {
  const buildings = [
    { x: -34, z: -25,  w: 4,   h: 14, d: 4,   color: '#3a3a4a' },
    { x: -31, z: -42,  w: 5,   h: 22, d: 5,   color: '#2a3a5a' },
    { x: -34, z: -58,  w: 3.5, h: 18, d: 3.5, color: '#3a4a3a' },
    { x: -31, z: -78,  w: 4.5, h: 26, d: 4.5, color: '#4a3a4a' },
    { x: -34, z: -100, w: 4,   h: 20, d: 4,   color: '#2a2a4a' },
    { x: -31, z: -118, w: 5,   h: 16, d: 5,   color: '#3a4a4a' },
    { x: 34,  z: -25,  w: 4,   h: 16, d: 4,   color: '#4a4a3a' },
    { x: 31,  z: -42,  w: 5,   h: 20, d: 5,   color: '#3a3a5a' },
    { x: 34,  z: -62,  w: 3.5, h: 24, d: 3.5, color: '#4a3a3a' },
    { x: 31,  z: -80,  w: 4,   h: 18, d: 4,   color: '#2a4a4a' },
    { x: 34,  z: -100, w: 5,   h: 22, d: 5,   color: '#3a2a4a' },
    { x: 31,  z: -118, w: 4,   h: 14, d: 4,   color: '#3a4a3a' },
  ]
  return (
    <group>
      {buildings.map((b, i) => <Skyscraper key={i} {...b} />)}
    </group>
  )
}

// ─── Zone 1: Welcome Plaza ────────────────────────────────────────────────────

function WelcomePlaza() {
  return (
    <group position={[0, 0, -12]}>
      {/* Plaza tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#9a8870" roughness={0.62} />
      </mesh>
      {/* Arch left pillar */}
      <mesh position={[-5.5, 4.5, 6]}>
        <cylinderGeometry args={[0.35, 0.45, 9, 12]} />
        <meshStandardMaterial color="#c0b090" roughness={0.42} metalness={0.25} />
      </mesh>
      {/* Arch right pillar */}
      <mesh position={[5.5, 4.5, 6]}>
        <cylinderGeometry args={[0.35, 0.45, 9, 12]} />
        <meshStandardMaterial color="#c0b090" roughness={0.42} metalness={0.25} />
      </mesh>
      {/* Arch crossbeam */}
      <mesh position={[0, 9.2, 6]}>
        <boxGeometry args={[12, 0.65, 0.65]} />
        <meshStandardMaterial color="#c0b090" roughness={0.38} metalness={0.25} />
      </mesh>
      {/* City sign */}
      <mesh position={[0, 8.0, 6.45]}>
        <boxGeometry args={[7.5, 1.15, 0.2]} />
        <meshStandardMaterial color="#1a2a4a" roughness={0.4} />
      </mesh>
      <Html position={[0, 8.0, 6.68]} center distanceFactor={12}>
        <div style={{ color: '#f0d080', fontFamily: 'sans-serif', fontSize: '12px', fontWeight: 900, letterSpacing: '0.28em', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          AKASH CITY
        </div>
      </Html>
      {/* Fountain basin */}
      <mesh position={[0, 0.25, -2.5]}>
        <cylinderGeometry args={[2.6, 2.9, 0.65, 18]} />
        <meshStandardMaterial color="#7a8090" roughness={0.45} />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.6, -2.5]}>
        <cylinderGeometry args={[2.2, 2.2, 0.2, 18]} />
        <meshStandardMaterial color="#3a90d0" transparent opacity={0.82} roughness={0.04} metalness={0.15} />
      </mesh>
      {/* Center column */}
      <mesh position={[0, 1.0, -2.5]}>
        <cylinderGeometry args={[0.14, 0.22, 1.4, 8]} />
        <meshStandardMaterial color="#9a9090" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.75, -2.5]}>
        <sphereGeometry args={[0.28, 10, 8]} />
        <meshStandardMaterial color="#3a90d0" transparent opacity={0.9} roughness={0.04} />
      </mesh>
      {/* Benches */}
      {([ [-6, -4, 0], [6, -4, 0], [-6, -1, Math.PI / 2], [6, -1, Math.PI / 2] ] as [number, number, number][]).map(([bx, bz, ry], i) => (
        <group key={i} position={[bx, 0, bz]} rotation={[0, ry, 0]}>
          <mesh position={[0, 0.48, 0]}>
            <boxGeometry args={[1.8, 0.1, 0.55]} />
            <meshStandardMaterial color="#6b4a20" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.3, 0.2]}>
            <boxGeometry args={[1.8, 0.42, 0.1]} />
            <meshStandardMaterial color="#6b4a20" roughness={0.8} />
          </mesh>
          {([-0.75, 0.75] as number[]).map((lx, j) => (
            <mesh key={j} position={[lx, 0.22, 0]}>
              <boxGeometry args={[0.1, 0.44, 0.5]} />
              <meshStandardMaterial color="#5a3a10" roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Corner trees */}
      {([ [-9, -5], [9, -5], [-9, 3], [9, 3] ] as [number, number][]).map(([tx, tz], i) => (
        <UrbanTree key={i} x={tx} z={tz} />
      ))}
    </group>
  )
}

// ─── Zone 2: University ───────────────────────────────────────────────────────

function University() {
  return (
    <group position={[-22, 0, -36]}>
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[10, 9, 7.5]} />
        <meshStandardMaterial color="#d8cdb8" roughness={0.6} />
      </mesh>
      {/* Center tower */}
      <mesh position={[0, 10.5, 0]}>
        <boxGeometry args={[3.2, 3, 3.2]} />
        <meshStandardMaterial color="#c8bda8" roughness={0.58} />
      </mesh>
      {/* Tower roof */}
      <mesh position={[0, 12.4, 0]}>
        <cylinderGeometry args={[0.2, 1.8, 1.2, 4]} />
        <meshStandardMaterial color="#7a3810" roughness={0.7} />
      </mesh>
      {/* Clock face */}
      <mesh position={[0, 11.5, 1.65]}>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 16]} />
        <meshStandardMaterial color="#f0e8d0" roughness={0.5} />
      </mesh>
      {/* Columns */}
      {([-3.8, -1.9, 0, 1.9, 3.8] as number[]).map((cx, i) => (
        <mesh key={i} position={[cx, 2.2, 3.95]}>
          <cylinderGeometry args={[0.2, 0.26, 4.4, 10]} />
          <meshStandardMaterial color="#e8e0cc" roughness={0.5} />
        </mesh>
      ))}
      {/* Portico */}
      <mesh position={[0, 4.5, 4.3]}>
        <boxGeometry args={[9.5, 0.4, 1.1]} />
        <meshStandardMaterial color="#d0c8b0" roughness={0.55} />
      </mesh>
      {/* Windows */}
      {[0, 1, 2, 3, 4].map(f =>
        ([-3.2, -1.2, 1.2, 3.2] as number[]).map((wx, wi) => (
          <mesh key={`${f}-${wi}`} position={[wx, 1.0 + f * 1.6, 3.8]}>
            <boxGeometry args={[0.75, 1.0, 0.08]} />
            <meshStandardMaterial color="#7ab8d8" emissive="#3a88aa" emissiveIntensity={0.2} roughness={0.08} transparent opacity={0.85} />
          </mesh>
        ))
      )}
      {/* Door */}
      <mesh position={[0, 1.4, 3.85]}>
        <boxGeometry args={[1.5, 2.8, 0.1]} />
        <meshStandardMaterial color="#4a3820" roughness={0.7} />
      </mesh>
      {/* Steps */}
      {[0, 1, 2].map(s => (
        <mesh key={s} position={[0, s * 0.18, 4.15 + s * 0.35]}>
          <boxGeometry args={[8, 0.18, 0.7]} />
          <meshStandardMaterial color="#c0b8a0" roughness={0.72} />
        </mesh>
      ))}
      <Html position={[0, 8.5, 3.9]} center distanceFactor={12}>
        <div style={{ color: '#f0e8d0', fontFamily: 'serif', fontSize: '8px', fontWeight: 900, letterSpacing: '0.2em', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          UNIVERSITY
        </div>
      </Html>
    </group>
  )
}

// ─── Zone 3: Achievement Center ───────────────────────────────────────────────

function AchievementCenter() {
  return (
    <group position={[22, 0, -36]}>
      {/* Glass tower */}
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[8.5, 12, 7]} />
        <meshStandardMaterial color="#1e2e3e" roughness={0.15} metalness={0.5} />
      </mesh>
      {/* Glass panels */}
      {Array.from({ length: 8 }).map((_, f) =>
        ([-2.8, -1.0, 0.8, 2.6] as number[]).map((wx, wi) => (
          <mesh key={`${f}-${wi}`} position={[wx, 0.8 + f * 1.4, 3.56]}>
            <boxGeometry args={[1.1, 1.1, 0.06]} />
            <meshStandardMaterial color="#66aacc" emissive="#2255aa" emissiveIntensity={seeded(f * 4 + wi) > 0.5 ? 0.35 : 0.08} roughness={0.04} transparent opacity={0.82} />
          </mesh>
        ))
      )}
      {/* Gold top band */}
      <mesh position={[0, 12.15, 0]}>
        <boxGeometry args={[8.8, 0.35, 7.3]} />
        <meshStandardMaterial color="#c8a820" roughness={0.25} metalness={0.75} />
      </mesh>
      {/* Trophy */}
      <mesh position={[0, 12.7, 0]}>
        <cylinderGeometry args={[0.65, 0.42, 1.0, 10]} />
        <meshStandardMaterial color="#ffd700" emissive="#cc8800" emissiveIntensity={0.45} roughness={0.28} metalness={0.65} />
      </mesh>
      <mesh position={[0, 13.45, 0]}>
        <sphereGeometry args={[0.38, 10, 8]} />
        <meshStandardMaterial color="#ffd700" emissive="#cc8800" emissiveIntensity={0.45} roughness={0.28} metalness={0.65} />
      </mesh>
      {/* Entrance */}
      <mesh position={[0, 1.6, 3.6]}>
        <boxGeometry args={[2.4, 3.2, 0.14]} />
        <meshStandardMaterial color="#0a1a2a" roughness={0.25} />
      </mesh>
      {[0, 1].map(s => (
        <mesh key={s} position={[0, s * 0.18, 4.1 + s * 0.4]}>
          <boxGeometry args={[6, 0.18, 0.85]} />
          <meshStandardMaterial color="#5a6070" roughness={0.65} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Zone 4: Everstage Office ─────────────────────────────────────────────────

function EverstageOffice() {
  return (
    <group position={[-22, 0, -64]}>
      {/* Tower */}
      <mesh position={[0, 7.5, 0]}>
        <boxGeometry args={[8, 15, 7]} />
        <meshStandardMaterial color="#2a3a5a" roughness={0.3} metalness={0.35} />
      </mesh>
      {/* Curtain glass */}
      <mesh position={[0, 7.5, 3.52]}>
        <boxGeometry args={[7.8, 15, 0.1]} />
        <meshStandardMaterial color="#5588bb" emissive="#1133aa" emissiveIntensity={0.1} roughness={0.04} transparent opacity={0.72} metalness={0.1} />
      </mesh>
      {/* Floor strips */}
      {Array.from({ length: 10 }).map((_, f) => (
        <mesh key={f} position={[0, 1.2 + f * 1.5, 3.58]}>
          <boxGeometry args={[8.1, 0.12, 0.08]} />
          <meshStandardMaterial color="#8899aa" roughness={0.28} metalness={0.65} />
        </mesh>
      ))}
      {/* Window cells */}
      {Array.from({ length: 9 }).map((_, f) =>
        ([-2.5, -0.8, 0.9, 2.6] as number[]).map((wx, wi) => (
          <mesh key={`${f}-${wi}`} position={[wx, 1.5 + f * 1.5, 3.6]}>
            <boxGeometry args={[1.0, 0.95, 0.05]} />
            <meshStandardMaterial color="#88bbee" emissive="#2244bb" emissiveIntensity={seeded(f * 4 + wi + 10) > 0.45 ? 0.35 : 0.05} roughness={0.04} transparent opacity={0.8} />
          </mesh>
        ))
      )}
      {/* Sign */}
      <Html position={[0, 14.5, 3.74]} center distanceFactor={14}>
        <div style={{ color: '#88ccff', fontFamily: 'monospace', fontSize: '8px', fontWeight: 900, letterSpacing: '0.2em', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          EVERSTAGE HQ
        </div>
      </Html>
      {/* Canopy */}
      <mesh position={[0, 3.4, 4.2]}>
        <boxGeometry args={[5, 0.2, 1.8]} />
        <meshStandardMaterial color="#5588bb" transparent opacity={0.65} roughness={0.1} />
      </mesh>
      {([-2, 2] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 1.7, 5.0]}>
          <cylinderGeometry args={[0.07, 0.09, 3.4, 6]} />
          <meshStandardMaterial color="#667788" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Zone 5: Chargebee Office ─────────────────────────────────────────────────

function ChargebeeOffice() {
  return (
    <group position={[22, 0, -64]}>
      {/* Podium */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[11, 3.6, 8.5]} />
        <meshStandardMaterial color="#4a4a5a" roughness={0.55} />
      </mesh>
      {/* Tower A */}
      <mesh position={[-2.2, 10.5, 0]}>
        <boxGeometry args={[4.5, 18, 6.5]} />
        <meshStandardMaterial color="#3a5a3a" roughness={0.28} metalness={0.32} />
      </mesh>
      {/* Tower B */}
      <mesh position={[2.8, 7.5, 0]}>
        <boxGeometry args={[4, 12, 6]} />
        <meshStandardMaterial color="#4a6a4a" roughness={0.28} metalness={0.3} />
      </mesh>
      {/* Tower A glass */}
      {Array.from({ length: 12 }).map((_, f) => (
        <mesh key={f} position={[-2.2, 2.1 + f * 1.5, 3.3]}>
          <boxGeometry args={[4.3, 1.0, 0.07]} />
          <meshStandardMaterial color="#77dd77" emissive="#226622" emissiveIntensity={seeded(f * 3 + 5) > 0.4 ? 0.28 : 0.06} roughness={0.04} transparent opacity={0.72} />
        </mesh>
      ))}
      {/* Tower B glass */}
      {Array.from({ length: 8 }).map((_, f) => (
        <mesh key={f} position={[2.8, 2.1 + f * 1.4, 3.05]}>
          <boxGeometry args={[3.8, 0.9, 0.07]} />
          <meshStandardMaterial color="#99ee99" emissive="#336633" emissiveIntensity={seeded(f * 4 + 8) > 0.4 ? 0.22 : 0.05} roughness={0.04} transparent opacity={0.7} />
        </mesh>
      ))}
      {/* Helipad */}
      <mesh position={[-2.2, 19.6, 0]}>
        <cylinderGeometry args={[1.6, 1.7, 0.18, 16]} />
        <meshStandardMaterial color="#333344" roughness={0.55} />
      </mesh>
      <mesh position={[-2.2, 19.72, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.06, 16]} />
        <meshStandardMaterial color="#cc2222" emissive="#881111" emissiveIntensity={0.35} roughness={0.55} />
      </mesh>
      <Html position={[-2.2, 18.5, 3.35]} center distanceFactor={14}>
        <div style={{ color: '#88ff88', fontFamily: 'monospace', fontSize: '8px', fontWeight: 900, letterSpacing: '0.18em', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          CHARGEBEE
        </div>
      </Html>
    </group>
  )
}

// ─── Zone 6: Tech Hub ─────────────────────────────────────────────────────────

function TechHub() {
  return (
    <group position={[0, 0, -90]}>
      {/* Circular tower */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[5.5, 6.2, 8, 14]} />
        <meshStandardMaterial color="#1e1e2e" roughness={0.35} metalness={0.45} />
      </mesh>
      {/* Glass dome */}
      <mesh position={[0, 8.5, 0]}>
        <sphereGeometry args={[4.2, 18, 10]} />
        <meshStandardMaterial color="#3a4a6a" roughness={0.12} metalness={0.65} transparent opacity={0.82} />
      </mesh>
      {/* Glowing band */}
      <mesh position={[0, 5.2, 0]}>
        <cylinderGeometry args={[5.55, 5.55, 1.8, 18]} />
        <meshStandardMaterial color="#44aaee" emissive="#1155aa" emissiveIntensity={0.3} roughness={0.04} transparent opacity={0.65} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 13.2, 0]}>
        <cylinderGeometry args={[0.06, 0.16, 3.5, 6]} />
        <meshStandardMaterial color="#888899" roughness={0.28} metalness={0.82} />
      </mesh>
      <mesh position={[0, 14.95, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#ff4444" emissive="#cc0000" emissiveIntensity={0.7} roughness={0.25} />
      </mesh>
      {/* Side wings */}
      {([-8.5, 8.5] as number[]).map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[3.8, 4.4, 5.5]} />
            <meshStandardMaterial color="#2a2a3a" roughness={0.48} />
          </mesh>
          {[0, 1, 2].map(f => (
            <mesh key={f} position={[0, 0.7 + f * 1.3, 2.78]}>
              <boxGeometry args={[2.8, 0.85, 0.08]} />
              <meshStandardMaterial color="#66ccff" emissive="#2288cc" emissiveIntensity={0.3} roughness={0.04} transparent opacity={0.78} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Entrance */}
      <mesh position={[0, 2.0, 6.3]}>
        <boxGeometry args={[3.2, 4.0, 0.2]} />
        <meshStandardMaterial color="#0a1a3a" roughness={0.28} />
      </mesh>
      <Html position={[0, 8.2, 5.6]} center distanceFactor={15}>
        <div style={{ color: '#66ccff', fontFamily: 'monospace', fontSize: '10px', fontWeight: 900, letterSpacing: '0.22em', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          TECH HUB
        </div>
      </Html>
      <pointLight position={[0, 8, 0]} color="#4488ff" intensity={2} distance={20} />
    </group>
  )
}

// ─── Zone 7: City Hall ────────────────────────────────────────────────────────

function CityHall() {
  return (
    <group position={[0, 0, -114]}>
      {/* Main body */}
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[13, 11, 8.5]} />
        <meshStandardMaterial color="#c8b898" roughness={0.5} />
      </mesh>
      {/* Dome drum */}
      <mesh position={[0, 11.2, 0]}>
        <cylinderGeometry args={[3.4, 3.8, 2.2, 18]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.5} />
      </mesh>
      {/* Dome */}
      <mesh position={[0, 13.2, 0]}>
        <sphereGeometry args={[3.6, 18, 10]} />
        <meshStandardMaterial color="#2a5a8a" roughness={0.18} metalness={0.52} transparent opacity={0.92} />
      </mesh>
      {/* Dome windows */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 3.45, 11.8, Math.sin(a) * 3.45]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.55, 1.1, 0.12]} />
            <meshStandardMaterial color="#88bbdd" emissive="#2255aa" emissiveIntensity={0.32} roughness={0.05} transparent opacity={0.82} />
          </mesh>
        )
      })}
      {/* Flag pole */}
      <mesh position={[0, 17.2, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 4.5, 6]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[0.7, 18.3, 0]}>
        <boxGeometry args={[1.4, 0.75, 0.04]} />
        <meshStandardMaterial color="#cc2233" side={THREE.DoubleSide} roughness={0.6} />
      </mesh>
      {/* Columns */}
      {([-5.5, -3, -0.5, 2, 4.5] as number[]).map((cx, i) => (
        <mesh key={i} position={[cx, 4.0, 4.5]}>
          <cylinderGeometry args={[0.28, 0.36, 8, 10]} />
          <meshStandardMaterial color="#e8e0cc" roughness={0.48} />
        </mesh>
      ))}
      {/* Entablature */}
      <mesh position={[0, 8.1, 4.85]}>
        <boxGeometry args={[12.5, 0.5, 1.2]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.5} />
      </mesh>
      {/* Windows */}
      {([-4.5, -2.2, 0, 2.2, 4.5] as number[]).map((wx, i) => (
        <mesh key={i} position={[wx, 6.8, 4.3]}>
          <boxGeometry args={[1.1, 2.0, 0.08]} />
          <meshStandardMaterial color="#88bbdd" emissive="#2255aa" emissiveIntensity={0.18} roughness={0.08} transparent opacity={0.85} />
        </mesh>
      ))}
      {/* Grand steps */}
      {[0, 1, 2, 3].map(s => (
        <mesh key={s} position={[0, s * 0.2, 5.0 + s * 0.4]}>
          <boxGeometry args={[11, 0.2, 0.9]} />
          <meshStandardMaterial color="#c0b090" roughness={0.65} />
        </mesh>
      ))}
      {/* Door */}
      <mesh position={[0, 2.0, 4.45]}>
        <boxGeometry args={[1.8, 4.0, 0.1]} />
        <meshStandardMaterial color="#3a2a10" roughness={0.7} />
      </mesh>
      <Html position={[0, 10.6, 4.6]} center distanceFactor={15}>
        <div style={{ color: '#f0e8d0', fontFamily: 'serif', fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          CITY HALL
        </div>
      </Html>
      <pointLight position={[0, 4, 0]} color="#ffe8cc" intensity={2.5} distance={16} />
    </group>
  )
}

// ─── Sports Complex ───────────────────────────────────────────────────────────

function RunningTrack() {
  return (
    <group position={[-26, 0, -21]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[17, 20]} />
        <meshStandardMaterial color="#c84b11" roughness={0.82} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[11, 14]} />
        <meshStandardMaterial color="#3a8030" roughness={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 7.2]}>
        <planeGeometry args={[14, 0.2]} />
        <meshBasicMaterial color="white" />
      </mesh>
      {[1, 2, 3].map(l => (
        <mesh key={l} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <ringGeometry args={[5.5 + l * 1.3, 5.5 + l * 1.3 + 0.07, 36]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
      {([-1.2, 0, 1.2] as number[]).map((lx, i) => (
        <mesh key={i} position={[lx, 0.13, 7.8]}>
          <boxGeometry args={[0.35, 0.26, 0.4]} />
          <meshStandardMaterial color="#cc0000" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 1.3, 10.2]}>
        <boxGeometry args={[3.2, 0.65, 0.14]} />
        <meshStandardMaterial color="#c84b11" roughness={0.45} />
      </mesh>
      <Html position={[0, 1.3, 10.4]} center distanceFactor={12}>
        <div style={{ color: 'white', fontFamily: 'monospace', fontSize: '9px', fontWeight: 900, letterSpacing: '0.22em', pointerEvents: 'none' }}>
          RUNNING
        </div>
      </Html>
    </group>
  )
}

function BadmintonCourt() {
  return (
    <group position={[26, 0, -24]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[9, 17]} />
        <meshStandardMaterial color="#4a8030" roughness={0.82} />
      </mesh>
      {([-3.05, 3.05] as number[]).map((lx, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[lx, 0.03, 0]}>
          <planeGeometry args={[0.06, 13.4]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
      {([-6.7, 6.7] as number[]).map((lz, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, lz]}>
          <planeGeometry args={[6.1, 0.06]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[6.1, 0.06]} />
        <meshBasicMaterial color="white" />
      </mesh>
      {([-3.4, 3.4] as number[]).map((px, i) => (
        <mesh key={i} position={[px, 0.8, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 1.6, 6]} />
          <meshStandardMaterial color="#888" metalness={0.5} roughness={0.38} />
        </mesh>
      ))}
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[7, 0.02, 0.02]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[(i - 4.5) * 0.72, 0.62, 0]}>
          <boxGeometry args={[0.02, 1.0, 0.02]} />
          <meshStandardMaterial color="white" transparent opacity={0.55} />
        </mesh>
      ))}
      <mesh position={[0, 1.55, 8.6]}>
        <boxGeometry args={[3.2, 0.65, 0.14]} />
        <meshStandardMaterial color="#2d7a2d" roughness={0.45} />
      </mesh>
      <Html position={[0, 1.55, 8.78]} center distanceFactor={12}>
        <div style={{ color: '#f0ffe0', fontFamily: 'monospace', fontSize: '9px', fontWeight: 900, letterSpacing: '0.22em', pointerEvents: 'none' }}>
          BADMINTON
        </div>
      </Html>
    </group>
  )
}

function SportsComplex() {
  return (
    <group>
      <RunningTrack />
      <BadmintonCourt />
      <mesh position={[0, 2.2, -3]}>
        <boxGeometry args={[6.5, 0.75, 0.18]} />
        <meshStandardMaterial color="#1a2a4a" roughness={0.55} />
      </mesh>
      <Html position={[0, 2.2, -2.88]} center distanceFactor={14}>
        <div style={{ color: '#88aaff', fontFamily: 'sans-serif', fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          SPORTS COMPLEX
        </div>
      </Html>
    </group>
  )
}

// ─── Zone Markers ─────────────────────────────────────────────────────────────

function ZoneMarker({ milestone, index, seenMilestones }: {
  milestone: typeof milestones[0]
  index: number
  seenMilestones: number[]
}) {
  const visited = seenMilestones.includes(index)
  const glowRef = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (glowRef.current && !visited) {
      glowRef.current.intensity = 1.5 + Math.sin(clock.getElapsedTime() * 2.5) * 0.7
    }
  })
  return (
    <group position={[milestone.zoneX, 0, milestone.zoneZ - milestone.zoneRadius + 1]}>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 2.2, 7]} />
        <meshStandardMaterial color="#555566" roughness={0.45} metalness={0.65} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[2.6, 0.8, 0.16]} />
        <meshStandardMaterial
          color={visited ? '#2a2a3a' : milestone.color + 'cc'}
          emissive={visited ? '#000000' : milestone.color}
          emissiveIntensity={visited ? 0 : 0.32}
          roughness={0.38}
        />
      </mesh>
      <Html position={[0, 2.4, 0.12]} center distanceFactor={12}>
        <div style={{
          color: visited ? '#888' : '#fff',
          fontFamily: 'sans-serif',
          fontSize: '9px',
          fontWeight: 900,
          letterSpacing: '0.14em',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          pointerEvents: 'none',
          textShadow: visited ? 'none' : `0 0 8px ${milestone.color}`,
        }}>
          {visited ? '✓ ' : ''}{milestone.label.replace('— ', '')}
        </div>
      </Html>
      {!visited && (
        <pointLight ref={glowRef} position={[0, 2.2, 0.6]} color={milestone.color} intensity={1.8} distance={11} />
      )}
    </group>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function City() {
  const seenMilestones = useGameStore(s => s.seenMilestones)
  return (
    <group>
      <CityGround />
      <BackgroundSkyline />
      <UrbanTrees />
      <StreetlightRow />
      <WelcomePlaza />
      <University />
      <AchievementCenter />
      <EverstageOffice />
      <ChargebeeOffice />
      <TechHub />
      <CityHall />
      <SportsComplex />
      {milestones.map((m, i) => (
        <ZoneMarker key={m.id} milestone={m} index={i} seenMilestones={seenMilestones} />
      ))}
    </group>
  )
}
