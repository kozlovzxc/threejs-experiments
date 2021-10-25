import { Component } from "../utils/component"
import * as THREE from "three"
import { TextureLoader } from "three"
import { globalGui } from "../utils/global-gui"

const textureLoader = new TextureLoader()
const gui = globalGui.addFolder("ball")

export class BallComponent extends Component {
  private ball: THREE.Mesh
  private readonly ballMap: THREE.Texture
  private readonly ballAO: THREE.Texture
  private readonly ballNormal: THREE.Texture
  private readonly ballRoughness: THREE.Texture
  private readonly ballHeight: THREE.Texture

  private state = {
    displacementScale: 0.1,
  }

  constructor() {
    super()

    this.ballMap = textureLoader.load(
      "/static/textures/Flower_Bud_001_SD/Flower_Bud_001_basecolor.jpg"
    )
    this.ballAO = textureLoader.load(
      "/static/textures/Flower_Bud_001_SD/Flower_Bud_001_ambientOcclusion.jpg"
    )
    this.ballNormal = textureLoader.load(
      "/static/textures/Flower_Bud_001_SD/Flower_Bud_001_normal.jpg"
    )
    this.ballRoughness = textureLoader.load(
      "/static/textures/Flower_Bud_001_SD/Flower_Bud_001_roughness.jpg"
    )
    this.ballHeight = textureLoader.load(
      "/static/textures/Flower_Bud_001_SD/Flower_Bud_001_height.png"
    )
    gui
      .add(this.state, "displacementScale")
      .min(0)
      .max(1)
      .step(0.05)
      .onFinishChange(this.render)
  }

  render = () => {
    if (this.ball != null) {
      this.remove(this.ball)
    }
    const ballMaterial = new THREE.MeshStandardMaterial({
      map: this.ballMap,
      aoMap: this.ballAO,
      normalMap: this.ballNormal,
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughnessMap: this.ballRoughness,
      displacementMap: this.ballHeight,
      displacementScale: this.state.displacementScale,
    })
    const ballGeometry = new THREE.SphereGeometry(1, 100, 100)
    ballGeometry.attributes.uv2 = ballGeometry.attributes.uv
    this.ball = new THREE.Mesh(ballGeometry, ballMaterial)
    this.ball.position.set(0, 1, 0)
    this.add(this.ball)
  }
}
