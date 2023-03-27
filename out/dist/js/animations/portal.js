import { getFrame } from "./frame.js";
/** All the frames, available for the portal animation. */
const frames = {
    stand0: getFrame(4, 0),
    stand1: getFrame(4, 1),
    stand2: getFrame(4, 2),
    stand3: getFrame(4, 3),
    stand4: getFrame(4, 4),
};
/** Animations for a portal.
 * The "off" animation played when the portal is not active. It's just one frame.
 * The "flashing" animation played when the portal is not active, but the Hero is close to it. It's two frames.
 * The "on" animation played when the portal is active. It's several frames.
 */
export default {
    off: [frames.stand0],
    flashing: [frames.stand0, frames.stand1],
    on: [frames.stand2, frames.stand3, frames.stand4],
};
//# sourceMappingURL=portal.js.map