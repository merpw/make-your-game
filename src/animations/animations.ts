import hero from "./hero.js"
import sheep from "./sheep.js"
import fungus from "./fungus.js"
import cloud from "./cloud.js"
import portal from "./portal.js"
import potion from "./potion.js"
import { wall, bush, grass } from "./static.js"

const animations = {
  hero,
  sheep,
  fungus,
  cloud,
  portal,
  potion,

  grass,
  wall,
  bush,
} as const

export type AssetName = keyof typeof animations

/** Type for names of animations for a specified {@link AssetName}*/
export type AnimationName<T extends AssetName> = keyof (typeof animations)[T]

export default animations
