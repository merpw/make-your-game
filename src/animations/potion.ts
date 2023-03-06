import { getFrame } from "./frame.js"

/** All the frames, available for the potion animation. */
const frames = {
  stand1: getFrame(5, 0),
  stand2: getFrame(5, 1),
}

/** Animation for a potion. The "stand" in place with bubbling. */
export default {
  stand: [frames.stand1, frames.stand2],
} as const
