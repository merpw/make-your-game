import { getFrame } from "./frame.js"

const grassFrame = getFrame(3, 2, 16, 16)

const wallFrame = getFrame(3, 0, 16, 16)

const bushFrame = getFrame(3, 1, 16, 16)

// static frames should contain only one frame passed in field `static`
// they will be rendered as a single image only once

export const grass = {
  static: [grassFrame]
} as const

export const wall = {
  static: [wallFrame]
} as const

export const bush = {
  static: [bushFrame]
} as const
