import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import fontUrl from "url:three/examples/fonts/helvetiker_regular.typeface.json"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { floor } from "./floor"
import { getHouse } from "./house"

/**
 * Base
 */
// Debug
const debug = {
  floorColor: "#70c86c",
  ball: {
    displacementScale: 0.1,
  },
}

// Canvas
const canvas = document.getElementById("webgl")

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper(20)
scene.add(axesHelper)

/**
 * Objects
 */
// Floor
scene.add(floor)
scene.add(getHouse())

// Text
let text: THREE.Mesh = undefined
let renderText = () => {
  if (text != null) {
    scene.remove(text)
  }
  let geometry = new THREE.TextBufferGeometry("Kamchatka 12", {
    font,
    size: 2,
    height: 0.5,
    curveSegments: 5,
  })
  geometry.center()
  const textMaterial = new THREE.MeshNormalMaterial()
  text = new THREE.Mesh(geometry, textMaterial)
  text.position.set(0, 20, 0)
  scene.add(text)
}
const fontLoader = new THREE.FontLoader()
let font: THREE.Font
fontLoader.load(fontUrl, (newFont) => {
  font = newFont
  renderText()
})

// Burger
const gltfLoader = new GLTFLoader()
gltfLoader.load("/static/models/burger.glb", (model) => {
  const burger = model.scene
  burger.position.set(2, 0, 0)
  scene.add(model.scene)
})

/**
 * Lights
 */
// Ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

// Directional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
)
scene.add(directionalLightHelper)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  200
)
camera.position.set(0, 2, 7)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
// Addes "weight" to camera movements
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
