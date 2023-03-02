import { getFrame } from "./frame.js"

const frames = {
  stand1: getFrame(4, 4, 16, 16),
  stand2: getFrame(4, 5, 16, 16),
}

export default {
  stand: [frames.stand1, frames.stand2],
} as const