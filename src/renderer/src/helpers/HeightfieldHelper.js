import { PlaneGeometry } from "three"

const modifyVerticies = (length, width, subX, subY) => {
  const geometry = new PlaneGeometry(length, width, subX, subY)
  const position = geometry.getAttribute("position")
  for (let x=0; x < subX; x++) {
    for (let y=0; y < subY; y++) {
      const index = (x + y * (subX + 1)) * 3
      position.array[index + 2] = -Math.random() * 1 // Replace calculateHeight with your logic to determine the height based on (x, y) coordinates
    }
  }
  return geometry
}

export default function Heightfield(length, width, subX, subY) {
  return modifyVerticies(length, width, subX, subY)
}