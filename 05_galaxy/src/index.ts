import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import { Color } from "three"

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.getElementById("webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */

const parameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 2,
  randomness: 0.25,
  randomnessPow: 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
}

let geometry: THREE.BufferGeometry
let material: THREE.PointsMaterial
let points: THREE.Points

export const generateGalaxy = () => {
  if (points != null) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)
  const insideColor = new Color(parameters.insideColor)
  const outsideColor = new Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    const radius = Math.random() * parameters.radius

    const rotationAngle = radius * parameters.spin
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2
    const angle = rotationAngle + branchAngle

    const getRandomness = () =>
      // Math.pow(Math.random(), parameters.randomnessPow) *
      // (Math.random() >= 0.5 ? 1 : -1) *
      Math.pow(Math.random(), parameters.randomnessPow) *
      (Math.random() > 0.5 ? 1 : -1) *
      parameters.randomness *
      (radius + 1)

    const randomShiftX = getRandomness()
    const randomShiftY = getRandomness()
    const randomShiftZ = getRandomness()

    positions[i3] = Math.cos(angle) * radius + randomShiftX
    positions[i3 + 1] = Math.sin(angle) * radius + randomShiftY
    positions[i3 + 2] = randomShiftZ

    const color = insideColor
      .clone()
      .lerp(outsideColor, radius / parameters.radius)
    colors[i3] = color.r
    // insideColor.r +
    // ((outsideColor.r - insideColor.r) * radius) / parameters.radius
    colors[i3 + 1] = color.g
    // insideColor.g +
    // ((outsideColor.g - insideColor.g) * radius) / parameters.radius
    colors[i3 + 2] = color.b
    // insideColor.b +
    // ((outsideColor.b - insideColor.b) * radius) / parameters.radius
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  )
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })
  points = new THREE.Points(geometry, material)
  scene.add(points)
}

gui
  .add(parameters, "count")
  .min(1000)
  .max(100 * 1000)
  .step(1000)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, "size")
  .min(0)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, "radius")
  .min(0)
  .max(20)
  .step(0.1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, "spin")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.05)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, "randomnessPow")
  .min(1)
  .max(10)
  .step(1)
  .onFinishChange(generateGalaxy)
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy)
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy)
generateGalaxy()

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
camera.position.x = -2
camera.position.y = 0
camera.position.z = 3
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  points.rotation.z = -elapsedTime * 0.01

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
