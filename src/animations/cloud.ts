import { getFrame } from "./frame.js"

const frames = {
  pinkBig: getFrame(3, 3, 16, 16),
  pinkMiddle: getFrame(3, 4, 16, 16),
  pinkSmall: getFrame(3, 5, 16, 16),
  blueBig: getFrame(5, 1, 16, 16),
  blueMiddle: getFrame(5, 2, 16, 16),
  blueSmall: getFrame(5, 3, 16, 16),
}

// TODO: maybe make cloud green to set any color using filters?

export default {
  pink: [
    frames.pinkMiddle,
    frames.pinkBig,
    frames.pinkMiddle,
    frames.pinkSmall,
  ],
  blue: [frames.blueSmall, frames.blueMiddle, frames.blueBig],
} as const
