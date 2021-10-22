import * as dat from "dat.gui"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { bushes } from "./objects/bush"
import { floor } from "./objects/grass"
import { graves } from "./objects/grave"
import { house } from "./objects/house"
import { doorLight } from "./objects/house/door"

/**
 * Variables
 */

const MOONLIGHT_COLOR = "#cacae7"
const FOG_COLOR = "#262837"

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.getElementById("webgl")

// Scene
const scene = new THREE.Scene()

// const axies = new THREE.AxesHelper(30)
// scene.add(axies)

/**
 * Complex Objects
 */

scene.add(house)
scene.add(graves)
scene.add(floor)
scene.add(...bushes)

// Fog
const fog = new THREE.Fog(FOG_COLOR, 1, 15)
scene.fog = fog

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(MOONLIGHT_COLOR, 0.15)
gui
  .add(ambientLight, "intensity")
  .name("ambient intensity")
  .min(0)
  .max(1)
  .step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight(MOONLIGHT_COLOR, 0.15)
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 7
moonLight.position.set(4, 5, -2)
gui.add(moonLight, "intensity").name("moon intensity").min(0).max(1).step(0.001)
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001)
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001)
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001)
scene.add(moonLight)

/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight("#ff00ff", 2, 3)
ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
scene.add(ghost1)

const ghost2 = new THREE.PointLight("#ffff00", 2, 3)
ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
scene.add(ghost2)

const ghost3 = new THREE.PointLight("#00ffff", 2, 3)
ghost3.castShadow = true
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
ghost3.position.x
scene.add(ghost3)

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

window.addEventListener("dblclick", () => {
  // Safari
  const fullscreenElement =
    document.fullscreenElement || (document as any).webkitFullscreenElement

  // All others
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else {
      ;(canvas as any).webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else {
      ;(document as any).webkitExitFullscreen()
    }
  }
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
camera.position.x = 0
camera.position.y = 4
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setClearColor(FOG_COLOR)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Door light
  const hideDoorLight = Math.sin(elapsedTime) > 0.8
  doorLight.visible = !hideDoorLight

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 6
  ghost1.position.z = Math.sin(ghost1Angle) * 6
  ghost1.position.y = Math.sin(ghost1Angle * 3)

  const ghost2Angle = -elapsedTime * 0.32 - Math.PI / 2
  ghost2.position.x = Math.cos(ghost2Angle) * 3
  ghost2.position.z = Math.sin(ghost2Angle) * 3
  ghost2.position.y = Math.sin(ghost2Angle * 3)

  const ghost3Angle = elapsedTime * 0.7 + Math.PI / 2
  const ghost3Radius = 5 + Math.sin(ghost3Angle) * 0.32
  ghost3.position.x = Math.cos(ghost3Angle) * ghost3Radius
  ghost3.position.z = Math.sin(ghost3Angle) * ghost3Radius
  ghost3.position.y = Math.sin(ghost3Angle * 2) + Math.sin(ghost3Angle * 3)

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
