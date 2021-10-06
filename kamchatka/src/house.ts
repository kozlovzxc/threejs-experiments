import * as THREE from "three"
import { globalGui } from "./gui"

const gui = globalGui.addFolder("house")

const debug = {
  wallsColor: "#4f7225",
  roofColor: "#4f7225",
}

export const house = new THREE.Group()
let walls: THREE.Mesh<THREE.BoxBufferGeometry, THREE.MeshStandardMaterial>
let roof: THREE.Mesh<THREE.ConeBufferGeometry, THREE.MeshStandardMaterial>

const wallsGeometry = new THREE.BoxBufferGeometry(2, 1, 2)
const roofGeometry = new THREE.ConeBufferGeometry(1.415, 1, 4)

const renderHouse = () => {
  if (walls != null) {
    house.remove(walls)
  }
  if (roof != null) {
    house.remove(roof)
  }

  const wallsMaterial = new THREE.MeshStandardMaterial({
    color: debug.wallsColor,
  })
  walls = new THREE.Mesh(wallsGeometry, wallsMaterial)
  walls.position.y = walls.geometry.parameters.height / 2

  const roofMaterial = new THREE.MeshStandardMaterial({
    color: debug.roofColor,
  })
  roof = new THREE.Mesh(roofGeometry, roofMaterial)
  roof.position.y =
    walls.geometry.parameters.height + roof.geometry.parameters.height / 2
  roof.rotation.y = Math.PI / 4

  house.add(walls)
  house.add(roof)
}
renderHouse()

gui.addColor(debug, "wallsColor").onFinishChange(renderHouse)
gui.addColor(debug, "roofColor").onFinishChange(renderHouse)
