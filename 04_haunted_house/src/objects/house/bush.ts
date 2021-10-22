import {
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  SphereBufferGeometry,
  TextureLoader,
} from "three"
import colorImg from "~/static/textures/bush/Grass_001_COLOR.jpg"
import normImg from "~/static/textures/bush/Grass_001_NORM.jpg"
import occImg from "~/static/textures/bush/Grass_001_OCC.jpg"

const textureLoader = new TextureLoader()
const color = textureLoader.load(colorImg)
const occ = textureLoader.load(occImg)
const norm = textureLoader.load(normImg)

const geometry = new SphereBufferGeometry(0.5)
const material = new MeshStandardMaterial({
  color: "green",
  map: color,
  aoMap: occ,
  normalMap: norm
})

export const getBush = () => {
  const bush = new Mesh(geometry, material)
  bush.geometry.setAttribute(
    "uv2",
    new Float32BufferAttribute(bush.geometry.attributes.uv.array, 2)
  )
  bush.castShadow = true
  return bush
}
