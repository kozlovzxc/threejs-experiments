import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import fontUrl from "url:three/examples/fonts/helvetiker_regular.typeface.json"
import * as dat from "dat.gui"
import { TextureLoader } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

/**
 * Base
 */
// Debug
const debug = {
  floorColor: "#5e51b3",
  ball: {
    displacementScale: 0.1,
  },
}
const gui = new dat.GUI()

// Canvas
const canvas = document.getElementById("webgl")

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper(20)
scene.add(axesHelper)

const textureLoader = new TextureLoader()

/**
 * Objects
 */
// Floor
let floor: THREE.Mesh
const renderFloor = () => {
  if (floor != null) {
    scene.remove(floor)
  }
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: debug.floorColor,
      metalness: 0,
      roughness: 0.5,
    })
  )
  floor.receiveShadow = true
  floor.rotation.x = -Math.PI * 0.5
  scene.add(floor)
}
renderFloor()
gui.addColor(debug, "floorColor").onFinishChange(renderFloor)

// Ball
const ballMap = textureLoader.load(
  "/static/textures/Flower_Bud_001_SD/Flower_Bud_001_basecolor.jpg"
)
const ballAO = textureLoader.load(
  "/static/textures/Flower_Bud_001_SD/Flower_Bud_001_ambientOcclusion.jpg"
)
const ballNormal = textureLoader.load(
  "/static/textures/Flower_Bud_001_SD/Flower_Bud_001_normal.jpg"
)
const ballRoughness = textureLoader.load(
  "/static/textures/Flower_Bud_001_SD/Flower_Bud_001_roughness.jpg"
)
const ballHeight = textureLoader.load(
  "/static/textures/Flower_Bud_001_SD/Flower_Bud_001_height.png"
)

let ball: THREE.Mesh
const renderBall = () => {
  if (ball != null) {
    scene.remove(ball)
  }

  const ballMaterial = new THREE.MeshStandardMaterial({
    map: ballMap,
    aoMap: ballAO,
    normalMap: ballNormal,
    normalScale: new THREE.Vector2(0.5, 0.5),
    roughnessMap: ballRoughness,
    displacementMap: ballHeight,
    displacementScale: debug.ball.displacementScale,
  })
  const ballGeometry = new THREE.SphereGeometry(1, 100, 100)
  ballGeometry.attributes.uv2 = ballGeometry.attributes.uv
  ball = new THREE.Mesh(ballGeometry, ballMaterial)
  ball.position.set(0, 1, 0)

  scene.add(ball)
}
renderBall()
gui
  .add(debug.ball, "displacementScale")
  .min(0)
  .max(1)
  .step(0.05)
  .onFinishChange(renderBall)

// Text
let text: THREE.Mesh = undefined
let renderText = () => {
  if (text != null) {
    scene.remove(text)
  }
  let geometry = new THREE.TextBufferGeometry("Hello", {
    font,
    size: 1,
    height: 0.2,
    curveSegments: 5,
  })
  geometry.center()
  const textMaterial = new THREE.MeshNormalMaterial()
  text = new THREE.Mesh(geometry, textMaterial)
  text.position.set(0, 3, 0)
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
gltfLoader.load('/static/models/burger.glb', (model) => {
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
  100
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
