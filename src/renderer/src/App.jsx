import { Canvas } from '@react-three/fiber'
import { EffectComposer, Vignette } from '@react-three/postprocessing'
import { KeyboardControls } from '@react-three/drei'
import Scene from './components/Scene'

export default function App() {
  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'right', keys: ['ArrowRight', 'KeyD'] },
        { name: 'jump', keys: ['Space'] },
        { name: 'sprint', keys: ['CapsLock']},
        { name: 'crouch', keys: ['KeyC']}
      ]}
    >
      <Canvas shadows>
        <EffectComposer>
          <Vignette />
        </EffectComposer>
        <Scene />
      </Canvas>
    </KeyboardControls>
  )
}