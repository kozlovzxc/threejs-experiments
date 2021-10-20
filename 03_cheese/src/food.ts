import * as THREE from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

const cache: Record<string, GLTF> = {}
interface Config {
  metalness?: number
}

export const getFood = (
  model: string,
  config: Config = {
    metalness: 0,
  }
): Promise<GLTF> => {
  return new Promise((resolve, reject) => {
    if (cache[model] != null) {
      resolve(cache[model])
    }
    const gltfLoader = new GLTFLoader()
    gltfLoader.load(`/static/models/${model}.glb`, (gltf) => {
      gltf.scene.traverse((child) => {
        if ("material" in child)
          (
            child as THREE.Mesh<
              THREE.BufferGeometry,
              THREE.MeshStandardMaterial
            >
          ).material.metalness = config.metalness
      })

      cache[model] = gltf
      resolve(cache[model])
    })
  })
}
