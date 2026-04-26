'use client'
import { useMemo } from 'react'

const WINDOW_COLORS = ['#00f5ff', '#a855f7', '#f59e0b', '#ec4899', '#3b82f6']
const N_BUILDINGS = 24
const TILE_LEN = 25
const TOTAL = N_BUILDINGS * TILE_LEN

function seeded(seed: number) {
  const x = Math.sin(seed + 1) * 43758.5453
  return x - Math.floor(x)
}

function buildingZ(i: number, scrollZ: number): number {
  return -(((i * TILE_LEN - scrollZ % TOTAL) + TOTAL) % TOTAL)
}

interface BuildingData {
  x: number
  width: number
  depth: number
  height: number
  winColor: string
}

export default function City({ scrollZ }: { scrollZ: number }) {
  const buildings = useMemo<BuildingData[]>(() => {
    return Array.from({ length: N_BUILDINGS }, (_, i) => {
      const side = seeded(i * 7.3) > 0.5 ? 1 : -1
      return {
        x: side * (8 + seeded(i * 3.1) * 7),
        width: 1.5 + seeded(i * 2.7) * 4,
        depth: 1.5 + seeded(i * 1.9) * 4,
        height: 4 + seeded(i * 1.3) * 18,
        winColor: WINDOW_COLORS[Math.floor(seeded(i * 5.1) * WINDOW_COLORS.length)],
      }
    })
  }, [])

  return (
    <group>
      {buildings.map((b, i) => {
        const z = buildingZ(i, scrollZ)
        return (
          <group key={i} position={[b.x, 0, z]}>
            {/* Main building */}
            <mesh position={[0, b.height / 2, 0]} castShadow>
              <boxGeometry args={[b.width, b.height, b.depth]} />
              <meshStandardMaterial
                color="#080818"
                emissive={b.winColor}
                emissiveIntensity={0.04}
                roughness={0.7}
                metalness={0.4}
              />
            </mesh>
            {/* Rooftop glow accent */}
            <mesh position={[0, b.height + 0.05, 0]}>
              <boxGeometry args={[b.width * 0.8, 0.1, b.depth * 0.8]} />
              <meshBasicMaterial color={b.winColor} transparent opacity={0.6} />
            </mesh>
          </group>
        )
      })}

      {/* Ground plane extending beyond track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -50]} receiveShadow>
        <planeGeometry args={[120, 500]} />
        <meshStandardMaterial color="#050510" roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}
