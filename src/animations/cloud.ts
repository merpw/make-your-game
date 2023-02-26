import { getFrame } from "./frame.js"

const frames = {
  pinkBig: getFrame(3, 3, 16, 16),
  pinkMiddle: getFrame(3, 4, 16, 16),
  pinkSmall: getFrame(3, 5, 16, 16),
  blueBig: getFrame(4, 5, 16, 16),
  blueMiddle: getFrame(4, 6, 16, 16),
  blueSmall: getFrame(4, 7, 16, 16)
}

export default {
  pink: [
    frames.pinkMiddle,
    frames.pinkBig,
    frames.pinkMiddle,
    frames.pinkSmall
  ],
  blue: [frames.blueBig, frames.blueMiddle, frames.blueSmall]
} as const
