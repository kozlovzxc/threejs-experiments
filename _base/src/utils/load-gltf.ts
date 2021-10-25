import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

const cache: Record<string, THREE.Group> = {}

export const loadGLTF = (model: string): Promise<THREE.Group> => {
  return new Promise((resolve, reject) => {
    if (cache[model] != null) {
      resolve(cache[model].clone())
      return
    }
    const gltfLoader = new GLTFLoader()
    gltfLoader.load(`/static/models/${model}.glb`, (gltf) => {
      // gltf.scene.traverse((child) => {
      //   if ("material" in child)
      //     (
      //       child as THREE.Mesh<
      //         THREE.BufferGeometry,
      //         THREE.MeshStandardMaterial
      //       >
      //     ).material.metalness = 0
      // })

      cache[model] = gltf.scene
      resolve(cache[model].clone())
    })
  })
}
