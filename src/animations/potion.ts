import { getFrame } from "./frame.js"

/** All the frames, available for the potion animation. */
const frames = {
  stand1: getFrame(4, 4),
  stand2: getFrame(4, 5),
}

/** Animation for a potion. The "stand" in place with bubbling. */
export default {
  stand: [frames.stand1, frames.stand2],
} as const
