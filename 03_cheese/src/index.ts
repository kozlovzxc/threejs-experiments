import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import fontUrl from "url:three/examples/fonts/helvetiker_regular.typeface.json"
import * as dat from "dat.gui"
import * as CANNON from "cannon-es"
import { getFood } from "./food"
import cannonDebugger from "cannon-es-debugger"

/**
 * Base
 */
// Debug
const debug = {
  enabled: false,
  floorColor: "#5e51b3",
  ball: {
    displacementScale: 0.1,
  },
}
const gui = new dat.GUI()
if (!debug.enabled) {
  gui.hide()
}

// Physics
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -0.982, 0), // m/s²
  allowSleep: true,
})

const defaultMaterial = new CANNON.Material("default")
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// Canvas
const canvas = document.getElementById("webgl")

// Scene
const scene = new THREE.Scene()

if (debug.enabled) {
  const axesHelper = new THREE.AxesHelper(20)
  scene.add(axesHelper)
}

/**
 * Objects
 */
// Floor
let floor: THREE.Mesh
let floorBody: CANNON.Body
let floorShape = new CANNON.Box(new CANNON.Vec3(5, 5, 0.01))
const renderFloor = () => {
  if (floor != null) {
    scene.remove(floor)
    world.removeBody(floorBody)
  }
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshNormalMaterial()
  )
  floor.receiveShadow = true
  floor.rotation.x = -Math.PI * 0.5
  scene.add(floor)

  floorBody = new CANNON.Body({
    type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
    shape: floorShape,
  })
  floorBody.position.copy(floor.position as any)
  floorBody.quaternion.copy(floor.quaternion as any)
  world.addBody(floorBody)
}
renderFloor()
gui.addColor(debug, "floorColor").onFinishChange(renderFloor)

// Cheese
const cheeseChunks: Array<{
  cheese: THREE.Group
  cheeseBoundariesBox: THREE.Vector3
  cheeseBody: CANNON.Body
}> = []
const renderCheese = async () => {
  const gltf = await getFood("cheese", { metalness: 0.5 })
  const cheeseModel = gltf.scene.clone()
  const boundingBox = new THREE.Box3().setFromObject(cheeseModel)
  const cheeseBoundariesBox = new THREE.Vector3(
    boundingBox.max.x - boundingBox.min.x,
    boundingBox.max.y - boundingBox.min.y,
    boundingBox.max.z - boundingBox.min.z
  )
  cheeseModel.position.y = -cheeseBoundariesBox.y / 2
  const cheese = new THREE.Group()
  cheese.add(cheeseModel)

  const scale = Math.random() + 0.5
  cheese.scale.set(scale, scale, scale)
  cheese.position.set((Math.random() - 0.5) * 5, 2, (Math.random() - 0.5) * 5)

  const cheeseBody = new CANNON.Body({
    mass: 1, // kg
    shape: new CANNON.Box(cheeseBoundariesBox.multiplyScalar(0.5) as any),
  })
  cheeseBody.position.copy(cheese.position as any)
  cheeseBody.quaternion.copy(cheese.quaternion as any)
  cheeseBody.applyImpulse(
    new CANNON.Vec3((Math.random() - 0.5) * 3, 0, (Math.random() - 0.5) * 3)
  )

  cheeseChunks.push({
    cheese,
    cheeseBoundariesBox,
    cheeseBody,
  })
  scene.add(cheese)
  world.addBody(cheeseBody)
}
renderCheese()
gui
  .add(debug.ball, "displacementScale")
  .min(0)
  .max(1)
  .step(0.05)
  .onFinishChange(renderCheese)

// Text
let text: THREE.Mesh = undefined
let renderText = () => {
  if (text != null) {
    scene.remove(text)
  }
  let geometry = new THREE.TextBufferGeometry("Wanna some cheeeeese?", {
    font,
    size: 1,
    height: 0.2,
    curveSegments: 5,
  })
  geometry.center()
  const textMaterial = new THREE.MeshNormalMaterial()
  text = new THREE.Mesh(geometry, textMaterial)
  text.position.set(0, 3, -3)
  scene.add(text)
}
const fontLoader = new THREE.FontLoader()
let font: THREE.Font
fontLoader.load(fontUrl, (newFont) => {
  font = newFont
  renderText()
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
if (debug.enabled) {
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
  )
  scene.add(directionalLightHelper)
}

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
camera.position.set(0, 4, 7)
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
if (debug.enabled) {
  cannonDebugger(scene, world.bodies)
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
const timeStep = 1 / 60 // seconds
let cheeseLastCreatedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  world.step(timeStep, deltaTime, 3)

  const cheeseDeltaTime = elapsedTime - cheeseLastCreatedTime
  if (cheeseDeltaTime > 0.25) {
    cheeseLastCreatedTime = elapsedTime
    void renderCheese()
  }

  cheeseChunks.forEach(({ cheese, cheeseBoundariesBox, cheeseBody }) => {
    cheese.position.copy(cheeseBody.position as any)
    // who knows why :)
    // cheese.position.y -= cheeseBoundariesBox.y
    cheese.quaternion.copy(cheeseBody.quaternion as any)
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
