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
    startColor: "#E76F51",
    endColor: "#228176",
  },
  items: {
    number: 500,
  },
}
const startColor = new THREE.Color(debug.background.startColor).toArray()
const endColor = new THREE.Color(debug.background.endColor).toArray()
const diffColor = startColor.map(
  (_, index) => (endColor[index] - startColor[index]) / debug.items.number
)
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.getElementById("webgl")

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(debug.background.startColor)

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
// Addes "weight" to camera movements
controls.enableDamping = true

/**
 * Objects
 */

// Food
const rotationSpeed = 0.01
const objectConfig = range(debug.items.number).map((_) => ({
  x: (Math.random() - 0.5) * rotationSpeed,
  y: (Math.random() - 0.5) * rotationSpeed,
}))
let broccoliChunks: THREE.Group[] = []
const meatChunks: THREE.Group[] = []
;(async () => {
  const radius = 20

  for (let i = 0; i < debug.items.number; i++) {
    const meat = await getFood("meatCooked")
    const [x, y, z] = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    )
      .normalize()
      .multiplyScalar(Math.random() * radius + 1)
      .toArray()
    meat.position.x = x
    meat.position.y = y
    meat.position.z = z
    meat.rotation.x = Math.random() * Math.PI * 2
    meat.rotation.y = Math.random() * Math.PI * 2
    const scale = Math.random() * 2 + 0.5
    meat.scale.set(scale, scale, scale)
    meatChunks.push(meat)
    scene.add(meat)
  }
})()

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

  const objects = [...meatChunks, ...broccoliChunks]

  objects.forEach((object, index) => {
    object.rotation.x += objectConfig[index].x
    object.rotation.y += objectConfig[index].y
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

const timeout = 0.0005
const timedTick = async () => {
  const banana = meatChunks.pop()
  if (banana == null) return
  const broccoli = await getFood("broccoli")
  broccoli.position.copy(banana.position)
  broccoli.rotation.copy(banana.rotation)
    broccoli.scale.copy(banana.scale)
  broccoliChunks = [broccoli, ...broccoliChunks]
  scene.remove(banana)
  scene.add(broccoli)

  scene.background = new THREE.Color().fromArray(
    (scene.background as THREE.Color)
      .toArray()
      .map((item, index) => item + diffColor[index])
  )

  setTimeout(timedTick, timeout)
}
setTimeout(timedTick, timeout)
