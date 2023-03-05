import { getFrame } from "./frame.js"

/** All the frames, available for the cloud animation.
 * The pink for the fungi.
 * The blue for the player.
 */
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
/** Animations for a cloud.
 * The pink cloud - fungi explosion.
 * The blue cloud - player spawning. */
export default {
  /** Pink cloud animation. Fungi explosion. */
  pink: [
    frames.pinkMiddle,
    frames.pinkBig,
    frames.pinkMiddle,
    frames.pinkSmall,
  ],
  /** Blue cloud animation. Player spawning. */
  blue: [frames.blueSmall, frames.blueMiddle, frames.blueBig, frames.blueGiant],
} as const
