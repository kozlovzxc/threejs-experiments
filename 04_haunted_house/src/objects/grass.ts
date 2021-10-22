import {
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  PlaneBufferGeometry,
  RepeatWrapping,
  TextureLoader,
} from "three"
import grassAmbientOcclusionImg from "~/static/textures/grass/Rock_Moss_001_ambientOcclusion.jpg"
import grassColorImg from "~/static/textures/grass/Rock_Moss_001_basecolor.jpg"
import grassNormalImg from "~/static/textures/grass/Rock_Moss_001_normal.jpg"
import grassRoughnessImg from "~/static/textures/grass/Rock_Moss_001_roughness.jpg"
import grassHeightImg from "~/static/textures/grass/Rock_Moss_001_height.png"

const textureLoader = new TextureLoader()

const GRASS_REPEAT = 8
const grassColorTexture = textureLoader.load(grassColorImg)
grassColorTexture.repeat.set(GRASS_REPEAT, GRASS_REPEAT)
grassColorTexture.wrapS = RepeatWrapping
grassColorTexture.wrapT = RepeatWrapping
const grassAmbientOcclusionTexture = textureLoader.load(
  grassAmbientOcclusionImg
)
grassAmbientOcclusionTexture.repeat.set(GRASS_REPEAT, GRASS_REPEAT)
grassAmbientOcclusionTexture.wrapS = RepeatWrapping
grassAmbientOcclusionTexture.wrapT = RepeatWrapping
const grassNormalTexture = textureLoader.load(grassNormalImg)
grassNormalTexture.repeat.set(GRASS_REPEAT, GRASS_REPEAT)
grassNormalTexture.wrapS = RepeatWrapping
grassNormalTexture.wrapT = RepeatWrapping
const grassRoughnessTexture = textureLoader.load(grassRoughnessImg)
grassRoughnessTexture.repeat.set(GRASS_REPEAT, GRASS_REPEAT)
grassRoughnessTexture.wrapS = RepeatWrapping
grassRoughnessTexture.wrapT = RepeatWrapping
const grassHeightTexture = textureLoader.load(grassHeightImg)
grassHeightTexture.repeat.set(GRASS_REPEAT, GRASS_REPEAT)
grassHeightTexture.wrapS = RepeatWrapping
grassHeightTexture.wrapT = RepeatWrapping

export const floor = new Mesh(
  new PlaneBufferGeometry(50, 50),
  new MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
    displacementMap: grassHeightTexture,
  })
)
floor.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
floor.position.y = -0.35
