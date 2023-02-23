import { getFrame } from "./frame.js"

const frames = {
  pinkBig: getFrame(3, 3),
  pinkMiddle: getFrame(3, 4),
  pinkSmall: getFrame(3, 5),
  blueBig: getFrame(4, 5),
  blueMiddle: getFrame(4, 6),
  blueSmall: getFrame(4, 7),
}

export default {
  pink: [
    frames.pinkMiddle,
    frames.pinkBig,
    frames.pinkMiddle,
    frames.pinkSmall,
  ],
  blue: [frames.blueBig, frames.blueMiddle, frames.blueSmall],
} as const
