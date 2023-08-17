import { OrbitControls, Sky } from "@react-three/drei"
import { Perf } from "r3f-perf"
import { Physics, RigidBody } from "@react-three/rapier"
import Terrain from "./models/Terrain"
import ThirdPersonController from "./util/ThirdPersonController"
import { Suspense } from "react"

export default function Scene() {
  return (
    <>
    <Perf position="bottom-left" />
    <Sky />
    <Suspense>
      <Physics gravity={[0, -9.8, 0]} interpolation={true}>
        <ThirdPersonController />
        <Terrain />
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
        <ambientLight intensity={0.25}/>
      </Physics>
    </Suspense>
    </>
  )
}