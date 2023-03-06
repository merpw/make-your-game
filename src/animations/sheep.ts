import { getFrame } from "./frame.js"

/** All the frames, available for the sheep animation.
 * The "demonized" means that the sheep is demonized.
 * The "left" frames are flipped horizontally.
 */
const frames = {
  right1demonized: getFrame(1, 0, 32, 22),
  right2demonized: getFrame(1, 1, 32, 22),
  right3demonized: getFrame(1, 2, 32, 22),

  left1demonized: getFrame(1, 0, 32, 22, true),
  left2demonized: getFrame(1, 1, 32, 22, true),
  left3demonized: getFrame(1, 2, 32, 22, true),

  down1demonized: getFrame(1, 3, 16, 30),
  down2demonized: getFrame(1, 4, 16, 30),
  down3demonized: getFrame(1, 5, 16, 30),

  up1demonized: getFrame(1, 6, 16, 30),
  up2demonized: getFrame(1, 7, 16, 32),
  up3demonized: getFrame(1, 8, 16, 32),

  right1: getFrame(2, 0, 26, 22),
  right2: getFrame(2, 1, 26, 22),
  right3: getFrame(2, 2, 26, 22),

  left1: getFrame(2, 0, 26, 22, true),
  left2: getFrame(2, 1, 26, 22, true),
  left3: getFrame(2, 2, 26, 22, true),

  down1: getFrame(2, 3, 16, 28),
  down2: getFrame(2, 4, 16, 28),
  down3: getFrame(2, 5, 16, 28),

  up1: getFrame(2, 6, 16, 28),
  up2: getFrame(2, 7, 16, 28),
  up3: getFrame(2, 8, 16, 28),
}

/** Animation for a sheep.
 *
 * The "stand" means that the sheep is standing in place. It's just one frame.
 * The "stand" animations implemented only for the demonized sheep, because not demonized sheep can eat the bush.
 * So the not demonized sheep can't be locked in the bush. And walls are always have gaps, empty or bush based.
 *
 * The "go" means that the sheep is moving. It's several frames.
 */
export default {
  goRightDemonized: [
    frames.right1demonized,
    frames.right2demonized,
    frames.right1demonized,
    frames.right3demonized,
  ],
  goLeftDemonized: [
    frames.left1demonized,
    frames.left2demonized,
    frames.left1demonized,
    frames.left3demonized,
  ],
  goDownDemonized: [
    frames.down1demonized,
    frames.down2demonized,
    frames.down1demonized,
    frames.down3demonized,
  ],
  goUpDemonized: [
    frames.up1demonized,
    frames.up2demonized,
    frames.up1demonized,
    frames.up3demonized,
  ],

  goRight: [frames.right1, frames.right2, frames.right1, frames.right3],
  goLeft: [frames.left1, frames.left2, frames.left1, frames.left3],
  goDown: [frames.down1, frames.down2, frames.down1, frames.down3],
  goUp: [frames.up1, frames.up2, frames.up1, frames.up3],
} as const
