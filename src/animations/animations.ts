import hero from "./hero.js"
import sheep from "./sheep.js"
import fungus from "./fungus.js"
import cloud from "./cloud.js"
import portal from "./portal.js"
import { wall, bush, grass } from "./static.js"

const animations = {
  hero,
  sheep,
  fungus,
  cloud,
  portal,

  grass,
  wall,
  bush,
} as const

export type AssetName = keyof typeof animations

export default animations
