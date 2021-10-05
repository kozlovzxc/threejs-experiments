import * as THREE from "three"
import { globalGui } from "./gui"

const gui = globalGui.addFolder("floor")

const debug = {
  floorColor: "#70c86c",
}

export const floor = new THREE.Group()

let earth: THREE.Mesh
const renderFloor = () => {
  if (earth != null) {
    floor.remove(earth)
  }
  earth = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
      color: debug.floorColor,
      metalness: 0,
      roughness: 0.5,
    })
  )
  earth.receiveShadow = true
  earth.rotation.x = -Math.PI * 0.5
  floor.add(earth)
}
renderFloor()

gui.addColor(debug, "floorColor").onFinishChange(renderFloor)
