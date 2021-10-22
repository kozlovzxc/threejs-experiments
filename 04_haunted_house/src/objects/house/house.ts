import {
  TextureLoader,
  Group,
  Mesh,
  BoxBufferGeometry,
  MeshStandardMaterial,
  Float32BufferAttribute,
} from "three"
import bricksAmbientOcclusionImg from "~static/textures/bricks/ambientOcclusion.jpg"
import bricksColorImg from "~static/textures/bricks/color.jpg"
import bricksNormalImg from "~static/textures/bricks/normal.jpg"
import bricksRoughnessImg from "~static/textures/bricks/roughness.jpg"
import { getBush } from "./bush"
import { door, doorLight } from "./door"
import { roof } from "./roof"
import { getWindow } from "./window"

/**
 * Textures
 */
const textureLoader = new TextureLoader()

const bricksColorTexture = textureLoader.load(bricksColorImg)
const bricksAmbientOcclusionTexture = textureLoader.load(
  bricksAmbientOcclusionImg
)
const bricksNormalTexture = textureLoader.load(bricksNormalImg)
const bricksRoughnessTexture = textureLoader.load(bricksRoughnessImg)

/**
 * House
 */

export const house = new Group()

const walls = new Mesh(
  new BoxBufferGeometry(4, 2, 4),
  new MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
)
walls.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.castShadow = true
walls.position.y = walls.geometry.parameters.height / 2
house.add(walls)

// Roof
roof.position.y =
  walls.geometry.parameters.height + roof.geometry.parameters.height / 2
house.add(roof)

// Windows
// const win1 = getWindow()
// win1.position.x = 1.2
// win1.position.y = walls.geometry.parameters.height / 2 + 0.3
// win1.position.z = walls.geometry.parameters.width / 2 - 0.04
// win1.scale.x = 2
// house.add(win1)

const win2 = getWindow()
win2.position.x = -1.2
win2.position.y = walls.geometry.parameters.height / 2 + 0.3
win2.position.z = walls.geometry.parameters.width / 2 - 0.04
win2.scale.x = 2
house.add(win2)

const win4 = getWindow()
win4.rotation.y = Math.PI * 0.5
win4.position.x = walls.geometry.parameters.width / 2
win4.position.y = walls.geometry.parameters.height / 2 + 0.3
win4.position.z = -1
win4.scale.x = 3
house.add(win4)

// Door
door.position.z = walls.geometry.parameters.width / 2 - 0.05
house.add(door)
house.add(doorLight)

// Bushes
const bush1 = getBush()
bush1.position.set(1.5, 0.3, 2.5)
house.add(bush1)

const bush2 = getBush()
bush2.scale.set(0.5, 0.5, 0.5)
bush2.position.set(0.85, 0.1, 2.3)
house.add(bush2)

const bush3 = getBush()
bush3.scale.set(0.7, 0.7, 0.7)
bush3.position.set(-0.9, 0.1, 2.4)
house.add(bush3)

const bush4 = getBush()
bush4.scale.set(0.2, 0.2, 0.2)
bush4.position.set(-1.25, 0.05, 2.6)
house.add(bush4)
