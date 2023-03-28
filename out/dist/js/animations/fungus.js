import { getFrame } from "./frame.js"
/** All the frames, available for the fungus animation. */
const frames = {
  stand1: getFrame(3, 6),
  stand2: getFrame(3, 7),
  stand3: getFrame(3, 8),
}
/** Animation for a fungus. The pulsation. */
export default {
  stand: [frames.stand1, frames.stand2, frames.stand3, frames.stand2],
}
//# sourceMappingURL=fungus.js.map
