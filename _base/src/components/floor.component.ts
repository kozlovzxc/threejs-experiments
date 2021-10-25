import * as THREE from "three"
import { Component } from "../utils/component"
import { globalGui } from "../utils/global-gui"

const gui = globalGui.addFolder("floor")

export class FloorComponent extends Component {
  private floor: THREE.Mesh

  private state = {
    floorColor: "#5e51b3",
  }

  constructor() {
    super()
    gui.addColor(this.state, "floorColor").onFinishChange(this.render)
  }

  render = () => {
    if (this.floor) {
      this.remove(this.floor)
    }
    this.floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: this.state.floorColor,
        metalness: 0,
        roughness: 0.5,
      })
    )
    this.floor.receiveShadow = true
    this.floor.rotation.x = -Math.PI * 0.5
    this.add(this.floor)
  }
}
