'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense, Component, ReactNode } from 'react'
import Scene from './Scene'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#050714]">
          <p className="text-red-400 font-mono text-xs p-4 max-w-md text-center">{this.state.error}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default function GameCanvas() {
  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position: [0, 3.8, 7.5], fov: 65, near: 0.1, far: 300 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', background: '#050714' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#050714')
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  )
}
