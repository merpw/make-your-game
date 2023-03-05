import { getFrame } from "./frame.js"

/** All the frames, available for the hero animation.
 * The left animation frames are flipped horizontally.
 * But the coordinates inside the atlas are still the same as for the right animation frames.
 */
const frames = {
  right1: getFrame(0, 0, 20, 32),
  right2: getFrame(0, 1, 20, 32),
  right3: getFrame(0, 2, 20, 32),
  left1: getFrame(0, 0, 20, 32, true),
  left2: getFrame(0, 1, 20, 32, true),
  left3: getFrame(0, 2, 20, 32, true),
  down1: getFrame(0, 3, 20, 32),
  down2: getFrame(0, 4, 20, 32),
  down3: getFrame(0, 5, 20, 32),
  up1: getFrame(0, 6, 20, 32),
  up2: getFrame(0, 7, 20, 32),
  up3: getFrame(0, 8, 20, 32),
}

/** Animations for a hero.
 * The "stand" animations are for standing, so only one frame.
 * The "go" animations are for moving, so several frames.
 */
export default {
  standRight: [frames.right1],
  standLeft: [frames.left1],
  standDown: [frames.down1],
  standUp: [frames.up1],
  goRight: [frames.right1, frames.right2, frames.right1, frames.right3],
  goLeft: [frames.left1, frames.left2, frames.left1, frames.left3],
  goDown: [frames.down1, frames.down2, frames.down1, frames.down3],
  goUp: [frames.up1, frames.up2, frames.up1, frames.up3],
} as const
