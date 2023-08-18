import React, { useEffect, useRef, useState } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier'
import { Vector3, Quaternion } from 'three'
import { setAnimationHelper, setSpeed } from '../../helpers/ControllerHelper'
import PlayerCharacter from '../models/PlayerCharacter'

export default function ThirdPersonController() {
  // refs
  const body = useRef()
  const yaw = useRef(0)
  const pitch = useRef(0)
  const zoom = useRef(2); // initial zoom level
  // keyboard controls
  const [ subscribeKeys, getKeys ] = useKeyboardControls()
  // control the animations
  const [animation, setAnimation] = useState({
    previous: 'Idle',
    current: 'Idle'
  })
  const [targetCameraPosition, setTargetCameraPosition] = useState(new Vector3())
  // Interpolation speed factor
  const lerpFactor = 0.05

  const { world } = useRapier()

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    
    if (!canvas) return
  
    const requestPointerLock = () => {
      canvas.requestPointerLock()
    }
  
    const handleMouseMove = (event) => {
      yaw.current -= event.movementX * 0.0005
  
      // Define the clamp values for pitch, which depend on the zoom level
      let minPitchValue = -1
      let maxPitchValue = 1
  
      // Adjust the pitch and clamp it
      let newPitch = pitch.current + event.movementY * 0.0005
      pitch.current = Math.max(minPitchValue, Math.min(maxPitchValue, newPitch))
    }
  
    const handleWheel = (event) => {
      // adjust zoom factor based on wheel delta
      zoom.current += event.deltaY * 0.001;
      // clamp zoom level between a min and max value
      zoom.current = Math.max(1, Math.min(5, zoom.current));
    }
  
    const onPointerLockChange = () => {
      if (document.pointerLockElement === canvas) {
        document.addEventListener('wheel', handleWheel);
        document.addEventListener("mousemove", handleMouseMove, false)
      } else {
        document.removeEventListener("mousemove", handleMouseMove, false)
        document.removeEventListener('wheel', handleWheel);
      }
    }
  
    canvas.addEventListener('click', requestPointerLock, false)
    document.addEventListener('pointerlockchange', onPointerLockChange, false)
    
    return () => {
      canvas.removeEventListener('click', requestPointerLock, false)
      document.removeEventListener('pointerlockchange', onPointerLockChange, false)
    }
  }, [])

  useFrame(({ camera }, delta) => {
    if (!body.current) return null;

    const { forward, backward, left, right, sprint, crouch } = getKeys()

    // Get the current position of the body from the rigid body's translation
    const bodyPosition = body.current.translation()

    const direction = new Vector3()
    direction.set(
      Number(right) - Number(left),
      0,
      Number(backward) - Number(forward)
    ).normalize();

    const _animation = setAnimationHelper(direction.x, direction.z, animation.current)
    if (_animation)
      setAnimation(prev => ({
        previous: prev.current,
        current: _animation
      }))

    let bodyRotation = new Quaternion();
    bodyRotation.setFromAxisAngle(new Vector3(0, 1, 0), yaw.current);
    direction.applyQuaternion(bodyRotation);

    let speed;
    if      (crouch) speed = setSpeed(direction.x, direction.z, 1);
    else if (sprint) speed = setSpeed(direction.x, direction.z, 4);
    else             speed = setSpeed(direction.x, direction.z, 2);

    // Setting the character's velocity directly
    const currentVelocity = body.current.linvel();  // Get the current linear velocity

    const horizontalSpeed = direction.multiplyScalar(speed);  // Calculate horizontal speed based on player input

    // Combine the y component of the current velocity (to respect gravity) 
    // with the calculated horizontal speed
    const newVelocity = new Vector3(horizontalSpeed.x, currentVelocity.y, horizontalSpeed.z);

    body.current.setLinvel(newVelocity);  // Set the new velocity

    body.current.setRotation(bodyRotation);

    // /* Camera Logic with bodyPosition */
    // const heightOffset = (zoom.current - 1) / 2; 
    // const cameraOffset = new Vector3(0, 1 + Math.sin(pitch.current) + heightOffset, zoom.current);

    // // Apply the body's rotation to the offset
    // cameraOffset.applyQuaternion(bodyRotation);

    // // Add the offset to the body position
    // const newCameraPosition = new Vector3().addVectors(bodyPosition, cameraOffset);
    
    // // Set the target camera position
    // setTargetCameraPosition(newCameraPosition);

    // // Interpolate the camera position towards the target position
    // camera.position.lerp(targetCameraPosition, lerpFactor);

    // // Adjust the lookAt position to look down on the body
    // const lookAtPosition = new Vector3(bodyPosition.x, bodyPosition.y + 2 - Math.sin(pitch.current), bodyPosition.z);
    // camera.lookAt(lookAtPosition);
  })


  return (
    <>
    <RigidBody
      type="dynamic"
      ref={body}
      friction={0}
      canSleep={false}
      gravity={[0, -9.81, 0]}
      position={[0, 10, 0]}
    >
      {/* <CapsuleCollider position={[0, 0.85, 0]} args={[0.6, 0.3, 1]} /> */}
      <PlayerCharacter animation={animation} />
    </RigidBody>
    </>
  )
}

