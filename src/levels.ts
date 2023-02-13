import Sheep from "./sheep.js"
import Bush from "./bush.js"

export const level1 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

/** sheeps for level1. maybe it should be inside board, not sure , but for editing levels, here is not bad.
 * Anyways the coordinates will be overriden by board random empty cell coordinates
 */
export const level1sheeps: Sheep[] = [
  new Sheep(1, 1, false, 1),
  new Sheep(1, 3, false, 2),
  new Sheep(1, 5, true, 3),
]

export const level1bushes: Bush[] = [
  new Bush(1, 1),
  new Bush(1, 3),
  new Bush(1, 5),
  new Bush(1, 7),
  new Bush(1, 9),
  new Bush(1, 11),
  new Bush(1, 13),
  new Bush(1, 15),
  new Bush(1, 17),
  new Bush(1, 19),
  new Bush(3, 1),
  new Bush(3, 3),
  new Bush(3, 5),
  new Bush(3, 7),
  new Bush(3, 9),
  new Bush(3, 11),
  new Bush(3, 13),
  new Bush(3, 15),
  new Bush(3, 17),
  new Bush(3, 19),
  new Bush(5, 1),
  new Bush(5, 3),
  new Bush(5, 5),
  new Bush(5, 7),
  new Bush(5, 9),
  new Bush(5, 11),
  new Bush(5, 13),
  new Bush(5, 15),
  new Bush(5, 17),
]
