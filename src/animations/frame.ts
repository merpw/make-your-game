export const ATLAS_PATH = "assets/atlas.png"
export const ATLAS_CELL_SIZE = 18
/** empty border around each cell added to right and bottom*/
const ATLAS_CELL_EMPTY_BORDER = 2
/** area (inside the square cell) plan to be covered by the art*/
export const ATLAS_CELL_ART_SIZE = ATLAS_CELL_SIZE - ATLAS_CELL_EMPTY_BORDER

// TODO: consider alternatives (e.g. SVG animate and transform instead of viewBox)

export type Frame = {
  viewBox: string
  flipX?: boolean
}
/** get {@link Frame}({@link viewBox}) from atlas */
export const getFrame = (
  col: number,
  row: number,
  width: number = ATLAS_CELL_SIZE,
  height: number = ATLAS_CELL_SIZE,
  flipX = false
): Frame => {
  return {
    viewBox: flipX
      ? `${-(col + 1) * ATLAS_CELL_SIZE + ATLAS_CELL_SIZE - width} ${
          row * ATLAS_CELL_SIZE
        } ${width} ${height}`
      : `${col * ATLAS_CELL_SIZE} ${row * ATLAS_CELL_SIZE} ${width} ${height}`,
    flipX,
  }
}
