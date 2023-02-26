import { getFrame } from "./frame.js"

const frames = {
  stand0: getFrame(4, 0, 16, 16),
  stand1: getFrame(4, 1, 16, 16),
  stand2: getFrame(4, 2, 16, 16),
  stand3: getFrame(4, 3, 16, 16)
}

export default {
  off: [frames.stand0],
  on: [frames.stand1, frames.stand2, frames.stand3]
} as const
