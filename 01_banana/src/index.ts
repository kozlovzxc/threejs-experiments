import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import { getFood } from "./food"
import { range } from "../utils/array"

/**
 * Base
 */
// Debug
const debug = {
  background: {
    color: "#335F70",
  },
  items: {
    number: 500,
  },
}
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.getElementById("webgl")

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(debug.background.color)

// const axesHelper = new THREE.AxesHelper(20)
// scene.add(axesHelper)

/**
 * Lights
 */
// Ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)

// Directional
const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(10, 10, 10)
// scene.add(directionalLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
)
// scene.add(directionalLightHelper)

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
camera.position.set(10, 10, 10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
// Add "weight" to camera movements
controls.enableDamping = true

/**
 * Objects
 */

// Food
const rotationSpeed = 0.01
let rotations: Array<{ x: number; y: number }> = []
let bananas: THREE.Group[] = []

const render = async () => {
  const radius = 20

  bananas.forEach((banana) => {
    scene.remove(banana)
  })
  bananas = []

  rotations = range(debug.items.number).map((_) => ({
    x: (Math.random() - 0.5) * rotationSpeed,
    y: (Math.random() - 0.5) * rotationSpeed,
  }))

  for (let i = 0; i < debug.items.number; i++) {
    const banana = await getFood("banana")
    const [x, y, z] = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    )
      .normalize()
      .multiplyScalar(Math.random() * radius + 2)
      .toArray()
    banana.position.x = x
    banana.position.y = y
    banana.position.z = z
    banana.rotation.x = Math.random() * Math.PI * 2
    banana.rotation.y = Math.random() * Math.PI * 2
    const scale = (Math.random() + 0.5) * 2
    banana.scale.set(scale, scale, scale)
    bananas.push(banana)
    scene.add(banana)
  }
}
void render()
gui
  .add(debug.items, "number")
  .min(100)
  .max(2000)
  .step(100)
  .onFinishChange(render)

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

  bananas.forEach((banana, index) => {
    banana.rotation.set(
      banana.rotation.x + rotations[index].x,
      banana.rotation.y + rotations[index].y,
      banana.rotation.z
    )
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
