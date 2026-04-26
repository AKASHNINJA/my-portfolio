'use client'

// Olympic stadium — packed bleachers with dense crowd
const SECTION_LEN = 14
const N_SECTIONS  = 16
const TOTAL       = N_SECTIONS * SECTION_LEN

function sectionZ(i: number, scrollZ: number): number {
  return -(((i * SECTION_LEN - scrollZ % TOTAL) + TOTAL) % TOTAL)
}

const CROWD_COLORS = ['#c8102e','#0057a8','#ffd700','#ffffff','#1a6b1a','#ff6600','#9c27b0','#e91e63','#00bcd4','#ff5722']
const HAIR_COLORS  = ['#1a0a00','#3d2b1f','#f5d090','#c97c3a','#111111','#8b4513']

function seeded(n: number) {
  const x = Math.sin(n + 17) * 43758.5453
  return x - Math.floor(x)
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seeded(seed) * arr.length)]
}

const ROWS     = 10
const PER_ROW  = 12
const ROW_H    = 0.82
const ROW_D    = 1.0

function CrowdPerson({ x, y, z, seed }: { x: number; y: number; z: number; seed: number }) {
  const bodyColor = pick(CROWD_COLORS, seed)
  const skinColor = seeded(seed * 3) > 0.5 ? '#e8b89a' : '#c68642'
  const hairColor = pick(HAIR_COLORS, seed * 7)
  const armUp     = seeded(seed * 11) > 0.7   // 30% chance arms raised

  return (
    <group position={[x, y, z]}>
      {/* Body */}
      <mesh position={[0, 0.13, 0]}>
        <capsuleGeometry args={[0.075, 0.18, 3, 6]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.09, 6, 5]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.092, 6, 4]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      {/* Left arm */}
      <mesh
        position={[-0.1, armUp ? 0.28 : 0.15, 0]}
        rotation={[0, 0, armUp ? -1.3 : -0.3]}
      >
        <capsuleGeometry args={[0.03, 0.14, 3, 5]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
      {/* Right arm */}
      <mesh
        position={[0.1, armUp ? 0.28 : 0.15, 0]}
        rotation={[0, 0, armUp ? 1.3 : 0.3]}
      >
        <capsuleGeometry args={[0.03, 0.14, 3, 5]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
    </group>
  )
}

function StadiumSection({ z, index }: { z: number; index: number }) {
  return (
    <group position={[0, 0, z]}>

      {/* ── LEFT BLEACHERS ── */}
      {Array.from({ length: ROWS }).map((_, r) => (
        <group key={`L${r}`}>
          {/* Concrete step */}
          <mesh position={[-8.2 - r * ROW_D, r * ROW_H + ROW_H / 2, 0]}>
            <boxGeometry args={[ROW_D, ROW_H, SECTION_LEN]} />
            <meshStandardMaterial color={r % 2 === 0 ? '#9e9e9e' : '#8a8a8a'} roughness={0.9} />
          </mesh>
          {/* Crowd */}
          {Array.from({ length: PER_ROW }).map((_, c) => (
            <CrowdPerson
              key={c}
              x={-8.2 - r * ROW_D + 0.28}
              y={r * ROW_H + ROW_H * 0.82}
              z={-SECTION_LEN / 2 + 0.7 + c * (SECTION_LEN / (PER_ROW - 0.5))}
              seed={index * 200 + r * 20 + c}
            />
          ))}
        </group>
      ))}

      {/* ── RIGHT BLEACHERS ── */}
      {Array.from({ length: ROWS }).map((_, r) => (
        <group key={`R${r}`}>
          <mesh position={[8.2 + r * ROW_D, r * ROW_H + ROW_H / 2, 0]}>
            <boxGeometry args={[ROW_D, ROW_H, SECTION_LEN]} />
            <meshStandardMaterial color={r % 2 === 0 ? '#9e9e9e' : '#8a8a8a'} roughness={0.9} />
          </mesh>
          {Array.from({ length: PER_ROW }).map((_, c) => (
            <CrowdPerson
              key={c}
              x={8.2 + r * ROW_D - 0.28}
              y={r * ROW_H + ROW_H * 0.82}
              z={-SECTION_LEN / 2 + 0.7 + c * (SECTION_LEN / (PER_ROW - 0.5))}
              seed={index * 300 + r * 25 + c}
            />
          ))}
        </group>
      ))}

      {/* ── FLOODLIGHT TOWERS every 4 sections ── */}
      {index % 4 === 0 && ([-21, 21] as number[]).map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color="#666" roughness={0.8} metalness={0.5} />
          </mesh>
          <mesh position={[0, 8, 0]}>
            <cylinderGeometry args={[0.15, 0.22, 15, 8]} />
            <meshStandardMaterial color="#888" roughness={0.6} metalness={0.7} />
          </mesh>
          <mesh position={[0, 15.5, 0]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[3.5, 0.5, 1.4]} />
            <meshStandardMaterial color="#ccc" emissive="#ffffdd" emissiveIntensity={0.9} />
          </mesh>
          <pointLight position={[0, 14, 0]} color="#fff9e8" intensity={5} distance={40} />
        </group>
      ))}

      {/* ── ROOF EDGE ── */}
      <mesh position={[-8.2 - ROWS * ROW_D + 0.5, ROWS * ROW_H + 0.4, 0]}>
        <boxGeometry args={[0.5, 0.3, SECTION_LEN]} />
        <meshStandardMaterial color="#bbb" roughness={0.7} />
      </mesh>
      <mesh position={[8.2 + ROWS * ROW_D - 0.5, ROWS * ROW_H + 0.4, 0]}>
        <boxGeometry args={[0.5, 0.3, SECTION_LEN]} />
        <meshStandardMaterial color="#bbb" roughness={0.7} />
      </mesh>

      {/* ── ROOFTOP OVERHANG ── */}
      <mesh position={[-8.2 - ROWS * ROW_D + 1.2, ROWS * ROW_H + 0.55, -SECTION_LEN * 0.1]}>
        <boxGeometry args={[2.8, 0.12, SECTION_LEN * 1.05]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} transparent opacity={0.85} />
      </mesh>
      <mesh position={[8.2 + ROWS * ROW_D - 1.2, ROWS * ROW_H + 0.55, -SECTION_LEN * 0.1]}>
        <boxGeometry args={[2.8, 0.12, SECTION_LEN * 1.05]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} transparent opacity={0.85} />
      </mesh>
    </group>
  )
}

export default function City({ scrollZ }: { scrollZ: number }) {
  return (
    <group>
      {Array.from({ length: N_SECTIONS }).map((_, i) => (
        <StadiumSection key={i} z={sectionZ(i, scrollZ)} index={i} />
      ))}
    </group>
  )
}
