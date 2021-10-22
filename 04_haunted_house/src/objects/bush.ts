import { getBush } from "./house/bush"

export const bushes = []

for (let i = 0; i < 10; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = Math.random() * 5.5 + 3.5

  const bush = getBush()
  bush.castShadow = true
  const newRadius = Math.sin(angle)
  bush.geometry.parameters.radius = newRadius
  bush.position.x = radius * Math.sin(angle)
  bush.position.z = radius * Math.cos(angle)
  bush.position.y = newRadius / 2

  bushes.push(bush)
}
