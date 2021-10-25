import * as THREE from "three"
// @ts-ignore
import fontUrl from "url:three/examples/fonts/helvetiker_regular.typeface.json"

const fontLoader = new THREE.FontLoader()
let font: THREE.Font

export const loadFont = () =>
  new Promise<THREE.Font>((resolve, reject) => {
    if (font != null) {
      resolve(font)
      return
    }

    fontLoader.load(fontUrl, (newFont) => {
      font = newFont
      resolve(font)
    })
  })
