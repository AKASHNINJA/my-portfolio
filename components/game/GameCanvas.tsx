'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Scene from './Scene'

export default function GameCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 3.8, 7.5], fov: 65, near: 0.1, far: 300 }}
      gl={{ antialias: true, alpha: false, toneMapping: 4, toneMappingExposure: 1.2 }}
      style={{ width: '100%', height: '100%', background: '#050714' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
