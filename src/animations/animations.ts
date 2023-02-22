import hero from "./hero.js"
import sheep from "./sheep.js"
import fungus from "./fungus.js"
import cloud from "./cloud.js"

const animations = {
  hero,
  sheep,
  fungus,
  cloud,
} as const

export type AssetName = keyof typeof animations

export default animations
