import { ATLAS_CELL_SIZE, getFrame } from "./frame.js";
const grassFrame = getFrame(3, 2, ATLAS_CELL_SIZE, ATLAS_CELL_SIZE);
const wallFrame = getFrame(3, 0);
const bushFrame = getFrame(3, 1);
// static frames should contain only one frame passed in field `static`
// they will be rendered as a single image only once
export const grass = {
    static: [grassFrame],
};
export const wall = {
    static: [wallFrame],
};
export const bush = {
    static: [bushFrame],
};
//# sourceMappingURL=static.js.map