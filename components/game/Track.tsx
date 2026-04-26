'use client'

const TILE_LEN = 20
const N_TILES = 10
const TOTAL = N_TILES * TILE_LEN
const TRACK_W = 11.5   // 8 athletic lanes
const INNER_W = 18     // green infield width

function tileZ(i: number, scrollZ: number): number {
  return -(((i * TILE_LEN - scrollZ % TOTAL) + TOTAL) % TOTAL)
}

// Standard 8-lane track: lane dividers at every 1.22m, scaled ×1.5
const LANE_DIVIDERS = [-4.27, -3.05, -1.83, -0.61, 0.61, 1.83, 3.05, 4.27]

function TrackTile({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      {/* Orange polyurethane track surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[TRACK_W, TILE_LEN]} />
        <meshStandardMaterial color="#c84b11" roughness={0.85} metalness={0} />
      </mesh>

      {/* White lane dividers */}
      {LANE_DIVIDERS.map((x, i) => (
        <mesh key={i} position={[x, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.06, TILE_LEN]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}

      {/* Left outer edge */}
      <mesh position={[-5.62, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, TILE_LEN]} />
        <meshBasicMaterial color="white" />
      </mesh>
      {/* Right outer edge */}
      <mesh position={[5.62, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, TILE_LEN]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Transverse distance marker at tile boundary */}
      <mesh position={[0, 0.006, -TILE_LEN / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TRACK_W, 0.15]} />
        <meshBasicMaterial color="white" transparent opacity={0.9} />
      </mesh>

      {/* Green infield (inner grass) */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[INNER_W, TILE_LEN]} />
        <meshStandardMaterial color="#2d7a2d" roughness={0.95} metalness={0} />
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
