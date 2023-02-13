import Sheep from "./sheep.js";
import Bush from "./bush.js";
export const level1 = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
];
/** sheeps for level1. maybe it should be inside board, not sure , but for editing levels, here is not bad.
 * Anyways the coordinates will be overriden by board random empty cell coordinates
 */
export const level1sheeps = [
    new Sheep(1, 1, false, 1),
    new Sheep(1, 3, false, 2),
    new Sheep(1, 5, true, 3),
];
export const level1bushes = [
    new Bush(1, 1),
    new Bush(1, 3),
    new Bush(1, 5),
    new Bush(1, 7),
];
