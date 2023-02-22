import hero from "./hero.js"
import sheep from "./sheep.js"
import fungus from "./fungus.js"
import cloud from "./cloud.js"
import portal from "./portal.js"

const animations = {
  hero,
  sheep,
  fungus,
  cloud,
  portal,
} as const

export type AssetName = keyof typeof animations

export default animations
