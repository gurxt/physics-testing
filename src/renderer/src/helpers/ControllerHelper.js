export function setSpeed(x, z, base) {
  if (z > 0   && x === 0) return base + base * 0.1
  if (z < 0   && x === 0) return base + base * 0.1
  if (z !== 0 && x !== 0) return base + base * 0.1
  if (z === 0 && x !== 0) return base
  return 0
}

export function setAnimationHelper(x, z, current) {
  if ((x !== 0 || z !== 0) && current !== "Walk")
    return "Walk"
  if ((x === 0 && z === 0) && current !== "Idle")
    return "Idle"
  return null
} 