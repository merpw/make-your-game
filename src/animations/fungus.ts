import { getFrame } from "./frame.js"

const frames = {
  stand1: getFrame(3, 6, 16, 16),
  stand2: getFrame(3, 7, 16, 16),
  stand3: getFrame(3, 8, 16, 16),
}

export default {
  stand: [frames.stand1, frames.stand2, frames.stand3, frames.stand2],
} as const
