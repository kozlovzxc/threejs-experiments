import {
  ConeBufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  Vector2,
} from "three"
import colorImg from "~/static/textures/roof/Wood_Roof_Tiles_001_COLOR.jpg"
import occImg from "~/static/textures/roof/Wood_Roof_Tiles_001_OCC.jpg"
import normImg from "~/static/textures/roof/Wood_Roof_Tiles_001_NORM.jpg"
import roughImg from "~/static/textures/roof/Wood_Roof_Tiles_001_ROUGH.jpg"

const textureLoader = new TextureLoader()
const color = textureLoader.load(colorImg)
const occ = textureLoader.load(occImg)
const norm = textureLoader.load(normImg)
const rough = textureLoader.load(roughImg)

const geometry = new ConeBufferGeometry(3.5, 2, 4)
const material = new MeshStandardMaterial({
  map: color,
  aoMap: occ,
  normalScale: new Vector2(0.3, 0.3),
  normalMap: norm,
  roughnessMap: rough,
})

export const roof = new Mesh(geometry, material)
roof.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(roof.geometry.attributes.uv.array, 2)
)
roof.rotation.y = Math.PI / 4
