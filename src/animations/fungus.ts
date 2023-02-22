import { getFrame } from "./frame"

const frames = {
  stand1: getFrame(3, 6),
  stand2: getFrame(3, 7),
  stand3: getFrame(3, 8),
}

export default {
  stand: [frames.stand1, frames.stand2, frames.stand3, frames.stand2],
} as const
