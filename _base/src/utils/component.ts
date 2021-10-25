import * as THREE from "three"

interface Tickable {
  onTick?: (elapsedTime: number) => void

  _tick(elapsedTime: number, deltaTime: number)
}

const isTickable = (something: object): something is Tickable =>
  "_tick" in something

export interface Renderable {
  render()
}

export const isRenderable = (something: object): something is Renderable =>
  "render" in something

export class Component extends THREE.Group implements Tickable, Renderable {
  onTick(elapsedTime: number) {}

  _tick(elapsedTime: number, deltaTime: number) {
    this.onTick(elapsedTime)
    this.children.forEach((child) => {
      if (isTickable(child)) {
        child._tick(elapsedTime, deltaTime)
      }
    })
  }

  render() {}
}

export const renderComponent = async (component: Component) => {
  await component.render()
  for (let child of component.children) {
    if (isRenderable(child)) {
      // TODO: fix types later
      await renderComponent(child as Component)
    }
  }
  return component
}
