import { OrbitControls } from "@react-three/drei"
import { Perf } from "r3f-perf"
import { Physics, RigidBody } from "@react-three/rapier"
import { Suspense, useMemo } from "react"

const Ground = () => {
  return (
    <RigidBody type="fixed">
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100, 64, 64]} />
        <meshStandardMaterial color={0xff0000} wireframe />
      </mesh>
    </RigidBody>
  )
}

const Bounds = ({ w, h }) => {
  const bounds = useMemo(() => {
    const bounds = []
    for (let i=0; i < 4; i++) {
      let position, rotation
      if (i === 0) { position = [-w / 2 - 0.25, h / 2, 0]; rotation = [0, Math.PI / 2, 0] }
      if (i === 1) { position = [w / 2 + 0.25, h / 2, 0]; rotation = [0, Math.PI / 2, 0] }
      if (i === 2) { position = [0, h / 2, w / 2 + 0.25]; rotation = [0, Math.PI, 0] }
      if (i === 3) { position = [0, h / 2, -w / 2 - 0.25]; rotation = [0, Math.PI, 0] }
      bounds.push(
        <RigidBody key={i} type="fixed" friction={0} restitution={0.2} position={position} rotation={rotation}>
          <mesh>
            <boxGeometry args={[i === 2 || i === 3 ? w + 1 : w, h, 0.5]} />
            <meshStandardMaterial color={0x000099} />
          </mesh>
        </RigidBody>
      )
    }
    
    return bounds
  })

  return bounds
}

const Ball = ({ position }) => {
  return (
    <RigidBody position={position}>
      <mesh>
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial color={0x00ff00} wireframe />
      </mesh>
    </RigidBody>
  )
}

export default function Scene() {
  return (
    <>
    <Perf position="bottom-left" />
    <Suspense>
      <Physics gravity={[0, -9.8, 0]}>
        {/* camera and controls */}
        <directionalLight
          position={[2, 10, 3]}
          intensity={1}
          castShadow={true}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <ambientLight intensity={1.25}/>
        <OrbitControls />
        {/* physics objects */}
        <Ground />
        <Ball position={[0, 2, 0]} />
        <Bounds w={100} h={5} />
        {/* --------------- */}
      </Physics>
    </Suspense>
    </>
  )
}