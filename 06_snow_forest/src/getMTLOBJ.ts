import * as THREE from "three"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"

const cache: Record<string, THREE.Group> = {}

const mtlLoader = new MTLLoader()
const objLoader = new OBJLoader()

export const getMTLOBJ = (model: string): Promise<THREE.Group> => {
  return new Promise((resolve, reject) => {
    if (cache[model] != null) {
      console.log("hit")
      resolve(cache[model])
      return
    }
    mtlLoader.load(`/static/models/${model}.mtl`, (mtl) => {
      mtl.preload()
      objLoader.setMaterials(mtl)
      objLoader.load(`/static/models/${model}.obj`, (obj) => {
        obj.traverse((child) => {
          child.castShadow = true
          if ("material" in child) {
            const material = (
              child as THREE.Mesh<
                THREE.BufferGeometry,
                THREE.MeshPhongMaterial[]
              >
            ).material
            material.forEach((subMaterial) => {
              subMaterial.shininess = 0
            })
          }
        })

        cache[model] = obj
        resolve(cache[model])
      })
    })
  })
}
