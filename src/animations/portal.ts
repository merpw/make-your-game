import { getFrame } from "./frame.js"

const frames = {
  stand0: getFrame(4, 0),
  stand1: getFrame(4, 1),
  stand2: getFrame(4, 2),
  stand3: getFrame(4, 3),
}

export default {
  off: [frames.stand0],
  on: [frames.stand1, frames.stand2, frames.stand3],
} as const
