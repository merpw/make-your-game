import hero from "./hero.js"
import sheep from "./sheep.js"

const animations = {
  hero,
  sheep,
} as const

export type AssetName = keyof typeof animations

export default animations
