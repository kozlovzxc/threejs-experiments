import {
    Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  PlaneBufferGeometry,
  PointLight,
  TextureLoader,
} from "three"
import doorAlphaImg from "~static/textures/door/alpha.jpg"
import doorAmbientOcclusionImg from "~static/textures/door/ambientOcclusion.jpg"
import doorColorImg from "~static/textures/door/color.jpg"
import doorHeightImg from "~static/textures/door/height.jpg"
import doorMetalnessImg from "~static/textures/door/metalness.jpg"
import doorNormalImg from "~static/textures/door/normal.jpg"
import doorRoughnessImg from "~static/textures/door/roughness.jpg"

const textureLoader = new TextureLoader()
const doorColorTexture = textureLoader.load(doorColorImg)
const doorAlphaTexture = textureLoader.load(doorAlphaImg)
const doorAmbientOcclusionTexture = textureLoader.load(doorAmbientOcclusionImg)
const doorHeightTexture = textureLoader.load(doorHeightImg)
const doorNormalTexture = textureLoader.load(doorNormalImg)
const doorMetalnessTexture = textureLoader.load(doorMetalnessImg)
const doorRoughnessTexture = textureLoader.load(doorRoughnessImg)

export const doorLight = new PointLight("#ff7d46", 1, 6)
doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7
doorLight.position.set(0, 2.2, 2.7)

export const door = new Mesh(
  new PlaneBufferGeometry(1.5, 2, 100, 100),
  new MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
  })
)
door.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = door.geometry.parameters.height / 2
