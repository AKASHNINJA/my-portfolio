'use client'
import * as THREE from 'three'

const TILE_LEN = 20
const N_TILES = 10
const TOTAL = N_TILES * TILE_LEN
const TRACK_W = 7.2

function tileZ(i: number, scrollZ: number): number {
  return -(((i * TILE_LEN - scrollZ % TOTAL) + TOTAL) % TOTAL)
}

function TrackTile({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[TRACK_W, TILE_LEN]} />
        <meshStandardMaterial color="#07071a" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Center dashes */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, TILE_LEN * 0.4]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.25} />
      </mesh>

      {/* Left lane divider */}
      <mesh position={[-2.4, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, TILE_LEN]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.5} />
      </mesh>

      {/* Right lane divider */}
      <mesh position={[2.4, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, TILE_LEN]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.5} />
      </mesh>

      {/* Left edge */}
      <mesh position={[-TRACK_W / 2, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, TILE_LEN]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.9} />
      </mesh>

      {/* Right edge */}
      <mesh position={[TRACK_W / 2, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, TILE_LEN]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.9} />
      </mesh>

      {/* Left barrier wall */}
      <mesh position={[-TRACK_W / 2 - 0.05, 0.4, 0]}>
        <boxGeometry args={[0.1, 0.8, TILE_LEN]} />
        <meshStandardMaterial color="#1a0030" emissive="#a855f7" emissiveIntensity={0.3} />
      </mesh>

      {/* Right barrier wall */}
      <mesh position={[TRACK_W / 2 + 0.05, 0.4, 0]}>
        <boxGeometry args={[0.1, 0.8, TILE_LEN]} />
        <meshStandardMaterial color="#1a0030" emissive="#a855f7" emissiveIntensity={0.3} />
      </mesh>

      {/* Transverse grid line at tile boundary */}
      <mesh position={[0, 0.005, -TILE_LEN / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TRACK_W, 0.1]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

export default function Track({ scrollZ }: { scrollZ: number }) {
  return (
    <group>
      {Array.from({ length: N_TILES }).map((_, i) => (
        <TrackTile key={i} z={tileZ(i, scrollZ)} />
      ))}
    </group>
  )
}
