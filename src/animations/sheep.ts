import { getFrame } from "./frame.js"

const frames = {
  right1demonized: getFrame(1, 0),
  right2demonized: getFrame(1, 1),
  right3demonized: getFrame(1, 2),
  left1demonized: getFrame(1, 0, undefined, undefined, true),
  left2demonized: getFrame(1, 1, undefined, undefined, true),
  left3demonized: getFrame(1, 2, undefined, undefined, true),
  down1demonized: getFrame(1, 3),
  down2demonized: getFrame(1, 4),
  down3demonized: getFrame(1, 5),
  up1demonized: getFrame(1, 6),
  up2demonized: getFrame(1, 7),
  up3demonized: getFrame(1, 8),
  right1: getFrame(2, 0),
  right2: getFrame(2, 1),
  right3: getFrame(2, 2),
  left1: getFrame(2, 0, undefined, undefined, true),
  left2: getFrame(2, 1, undefined, undefined, true),
  left3: getFrame(2, 2, undefined, undefined, true),
  down1: getFrame(2, 3),
  down2: getFrame(2, 4),
  down3: getFrame(2, 5),
  up1: getFrame(2, 6),
  up2: getFrame(2, 7),
  up3: getFrame(2, 8),
}

export default {
  standRightDemonized: [frames.right1demonized],
  standLeftDemonized: [frames.left1demonized],
  standDownDemonized: [frames.down1demonized],
  standUpDemonized: [frames.up1demonized],

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

  standRight: [frames.right1],
  standLeft: [frames.left1],
  standDown: [frames.down1],
  standUp: [frames.up1],

  goRight: [frames.right1, frames.right2, frames.right1, frames.right3],
  goLeft: [frames.left1, frames.left2, frames.left1, frames.left3],
  goDown: [frames.down1, frames.down2, frames.down1, frames.down3],
  goUp: [frames.up1, frames.up2, frames.up1, frames.up3],
} as const
