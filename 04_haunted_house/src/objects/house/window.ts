import {
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneBufferGeometry,
  TextureLoader,
} from "three"
import ambientOcclusionImg from "~static/textures/window/Glass_Window_002_ambientOcclusion.jpg"
import colorImg from "~static/textures/window/Glass_Window_002_basecolor.jpg"
import metallicImg from "~static/textures/window/Glass_Window_002_metallic.jpg"
import normalImg from "~static/textures/window/Glass_Window_002_normal.jpg"
import opacityImg from "~static/textures/window/Glass_Window_002_opacity.jpg"
import roughnessImg from "~static/textures/window/Glass_Window_002_roughness.jpg"
import heightImg from "~static/textures/window/Glass_Window_002_height.png"

const textureLoader = new TextureLoader()
const ambientOcclusion = textureLoader.load(ambientOcclusionImg)
const color = textureLoader.load(colorImg)
const metallic = textureLoader.load(metallicImg)
const normal = textureLoader.load(normalImg)
const opacity = textureLoader.load(opacityImg)
const roughness = textureLoader.load(roughnessImg)
const heightTexture = textureLoader.load(heightImg)

export const getWindow = () => {
  const window = new Group()
  const width = 0.5
  const height = 0.7
  const background = new Mesh(
    new PlaneBufferGeometry(width, height, 100, 100),
    new MeshStandardMaterial({ color: "black" })
  )
  window.add(background)
  background.position.z = 0.05
  const glass = new Mesh(
    new PlaneBufferGeometry(width, height, 100, 100),
    new MeshStandardMaterial({
      aoMap: ambientOcclusion,
      map: color,
      normalMap: normal,
      roughnessMap: roughness,
      metalnessMap: metallic,
      displacementMap: heightTexture,
      displacementScale: 0.1,
      transparent: true,
      alphaMap: opacity,
    })
  )
  glass.geometry.setAttribute(
    "uv2",
    new Float32BufferAttribute(glass.geometry.attributes.uv.array, 2)
  )
  window.add(glass)
  return window
}
