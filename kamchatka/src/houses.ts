import * as THREE from "three"
import { getHouse } from "./house"

export const getHouses = () => {
  const houses = new THREE.Group()
  const house1 = getHouse()

  houses.add(house1)

  return houses
}
