import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import { getMTLOBJ } from "./getMTLOBJ"
import { Snow } from "./snow"

/**
 * Base
 */
// Debug
const debug = {
  floorColor: "#f0f0f0",
  sceneColor: "#d2dae7",
  snow: {
    points: 20000,
  },
}
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.getElementById("webgl")

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(debug.sceneColor)

// const axesHelper = new THREE.AxesHelper(20)
// scene.add(axesHelper)

const fog = new THREE.Fog(debug.sceneColor, 1, 100)
scene.fog = fog

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
    new THREE.PlaneGeometry(1000, 1000),
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

// Tree
const templateConfig = [
  { name: "BirchTree_Dead_Snow_1", number: 20 },
  { name: "BirchTree_Dead_Snow_2", number: 20 },
  { name: "BirchTree_Dead_Snow_3", number: 20 },
  { name: "BirchTree_Dead_Snow_4", number: 20 },
  { name: "BirchTree_Dead_Snow_5", number: 20 },

  { name: "BirchTree_Snow_1", number: 100 },
  { name: "BirchTree_Snow_2", number: 100 },
  { name: "BirchTree_Snow_3", number: 100 },
  { name: "BirchTree_Snow_4", number: 100 },
  { name: "BirchTree_Snow_5", number: 100 },

  { name: "PineTree_Snow_1", number: 200 },
  { name: "PineTree_Snow_2", number: 200 },
  { name: "PineTree_Snow_3", number: 200 },
  { name: "PineTree_Snow_4", number: 200 },
  { name: "PineTree_Snow_5", number: 200 },

  { name: "Rock_Snow_2", number: 100 },
  { name: "Rock_Snow_4", number: 100 },
  { name: "Rock_Snow_5", number: 100 },
  { name: "Rock_Snow_6", number: 100 },
  { name: "Rock_Snow_7", number: 100 },

  { name: "TreeStump_Snow", number: 50 },
  { name: "WoodLog_Snow", number: 50 },
]
const renderObjects = async () => {
  const objects: THREE.Group[] = []
  for (let { name, number } of templateConfig) {
    const template = await getMTLOBJ(name)
    for (let i = 0; i < number; i++) {
      const newObject = template.clone()
      newObject.position.set(
        (Math.random() - 0.5) * 2 * 100,
        0,
        (Math.random() - 0.5) * 2 * 100
      )
      newObject.rotation.y = Math.random() * 2 * Math.PI
      objects.push(newObject)
    }
  }
  scene.add(...objects)
}
void renderObjects()

const snow = new Snow(debug.snow.points, 20)
scene.add(snow)

/**
 * Lights
 */
// Ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Directional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 100
directionalLight.shadow.camera.left = -100
directionalLight.shadow.camera.top = 100
directionalLight.shadow.camera.right = 100
directionalLight.shadow.camera.bottom = -100
directionalLight.position.set(30, 30, 30)
scene.add(directionalLight)
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight
// )
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
  200
)
camera.position.set(0, 10, 15)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
// Adds "weight" to camera movements
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

  snow.tick(elapsedTime)

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
