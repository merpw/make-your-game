import hero from "./hero.js"
import sheep from "./sheep.js"
import fungus from "./fungus.js"

const animations = {
  hero,
  sheep,
  fungus,
} as const

export type AssetName = keyof typeof animations

export default animations
