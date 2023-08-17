import { useAnimations, useGLTF } from "@react-three/drei"
import { useEffect, useRef } from "react"

export default function PlayerCharacter({ animation }) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/BigBattri-transformed.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    actions[animation.current].reset().play()
    actions[animation.previous].crossFadeTo(actions[animation.current], 0.5, false)
  }, [animation.current])

  return (
    <group dispose={null}>
      <group ref={group} rotation={[0, -Math.PI, 0]} name="Scene">
        <group name="armature" position={[0, -0.034, -0.011]} scale={0.848}>
          <primitive object={nodes.spine} />
          <primitive object={nodes.pole_targetl} />
          <primitive object={nodes.controllerl} />
          <primitive object={nodes.pole_targetr} />
          <primitive object={nodes.controllerr} />
        </group>
        <skinnedMesh castShadow name="Body" geometry={nodes.Body.geometry} material={materials.Material} skeleton={nodes.Body.skeleton} position={[0, -0.034, -0.011]} scale={0.848} />
      </group>
    </group>
  )
}

useGLTF.preload('/BigBattri-transformed.glb')