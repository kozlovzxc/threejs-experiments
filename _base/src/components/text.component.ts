import { Component } from "../utils/component"
import * as THREE from "three"
import { loadFont } from "../utils/load-font"

export class TextComponent extends Component {
  private text: THREE.Mesh

  async render() {
    if (this.text != null) {
      this.remove(this.text)
    }
    const font = await loadFont()
    let geometry = new THREE.TextBufferGeometry("Hello", {
      font,
      size: 1,
      height: 0.2,
      curveSegments: 5,
    })
    geometry.center()
    const textMaterial = new THREE.MeshNormalMaterial()
    this.text = new THREE.Mesh(geometry, textMaterial)
    this.text.position.set(0, 3, 0)
    this.add(this.text)
  }
}
