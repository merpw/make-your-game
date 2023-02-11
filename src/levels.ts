import Sheep from "./sheep.js"

export const level1 = [
  [0, 0, 2, 0, 2, 0, 0],
  [0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0],
]

/** sheeps for level1. maybe it should be inside board, not sure , but for editing levels, here is not bad.
 * Anyways the coordinates will be overriden by board random empty cell coordinates
 */
export const level1sheeps: Sheep[] = [
  new Sheep(1, 1, true, 1),
  new Sheep(1, 3, false, 2),
  new Sheep(1, 5, false, 3),
]
