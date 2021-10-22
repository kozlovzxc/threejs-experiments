import {
  Group,
  BoxBufferGeometry,
  MeshStandardMaterial,
  Mesh,
  TextureLoader,
  Float32BufferAttribute,
} from "three"
import graveColorImage from "~/static/textures/grave/Blue_Marble_001_COLOR.jpg"
import graveNormalImage from '~/static/textures/grave/Blue_Marble_001_NRM.jpg'
import graveOCCImage from "~/static/textures/grave/Blue_Marble_001_OCC.jpg"

// Textures

const textureLoader = new TextureLoader()
const graveColorTexture = textureLoader.load(graveColorImage)
const graveOCCTexture = textureLoader.load(graveOCCImage)
const graveNormalexture = textureLoader.load(graveNormalImage)

export const graves = new Group()

const graveGeometry = new BoxBufferGeometry(0.6, 1, 0.2)
const graveMaterial = new MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveOCCTexture,
  normalMap: graveNormalexture,
})

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = Math.random() * 5.5 + 3.5

  const grave = new Mesh(graveGeometry, graveMaterial)
  grave.geometry.setAttribute(
    "uv2",
    new Float32BufferAttribute(grave.geometry.attributes.uv.array, 2)
  )
  grave.castShadow = true
  grave.position.x = radius * Math.sin(angle)
  grave.position.z = radius * Math.cos(angle)
  grave.position.y = grave.geometry.parameters.height / 3
  grave.rotation.x = Math.random() * 0.25 - 0.125
  grave.rotation.z = Math.random() * 0.25 - 0.125
  graves.add(grave)
}
