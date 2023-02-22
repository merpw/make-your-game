import { getFrame } from "./frame.js"

// TODO: define width and height
const frames = {
  right1: getFrame(0, 0),
  right2: getFrame(0, 1),
  right3: getFrame(0, 2),
  left1: getFrame(0, 0, undefined, undefined, true),
  left2: getFrame(0, 1, undefined, undefined, true),
  left3: getFrame(0, 2, undefined, undefined, true),
  down1: getFrame(0, 3),
  down2: getFrame(0, 4),
  down3: getFrame(0, 5),
  up1: getFrame(0, 6),
  up2: getFrame(0, 7),
  up3: getFrame(0, 8),
}

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
