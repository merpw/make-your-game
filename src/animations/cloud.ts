import { getFrame } from "./frame.js"

const frames = {
  pinkBig: getFrame(3, 3),
  pinkMiddle: getFrame(3, 4),
  pinkSmall: getFrame(3, 5),
  blueGiant: getFrame(5, 1),
  blueBig: getFrame(5, 2),
  blueMiddle: getFrame(5, 3),
  blueSmall: getFrame(5, 4),
}

// TODO: maybe make cloud green to set any color using filters?

export default {
  pink: [
    frames.pinkMiddle,
    frames.pinkBig,
    frames.pinkMiddle,
    frames.pinkSmall,
  ],
  blue: [frames.blueSmall, frames.blueMiddle, frames.blueBig, frames.blueGiant],
} as const
