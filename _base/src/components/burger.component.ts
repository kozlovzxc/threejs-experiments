import { Component } from "../utils/component"
import { loadGLTF } from "../utils/load-gltf"

export class BurgerComponent extends Component {
  async render() {
    const burger = await loadGLTF("burger")
    burger.position.set(2, 0, 0)
    this.add(burger)
  }
}
