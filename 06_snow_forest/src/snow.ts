import * as THREE from "three"
import { Points } from "three"

const material = new THREE.PointsMaterial({
  size: 0.03,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  color: "white",
})

export class Snow extends THREE.Group {
  private GROUPS = 4

  constructor(private number: number, private range: number) {
    super()
    for (let group = 0; group < this.GROUPS; group++) {
      const positions = new Float32Array(number * 3)
      const geometry = new THREE.BufferGeometry()
      for (let i = 0; i < number / this.GROUPS; i++) {
        const i3 = i * 3
        positions[i3 + 0] = (Math.random() - 0.5) * range
        positions[i3 + 1] = (Math.random() - 0.5) * range
        positions[i3 + 2] = (Math.random() - 0.5) * range
      }
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      )
      const points = new Points(geometry, material)
      points.rotation.x = Math.random() * 2 * Math.PI
      points.rotation.y = Math.random() * 2 * Math.PI
      this.add(points)
    }
  }

  tick(elapsedTime: number) {
    for (let i = 0; i < this.GROUPS; i++) {
      this.children[i].rotation.y += (i % 2 === 0 ? 1 : -1) * 0.002
    }
  }
}
