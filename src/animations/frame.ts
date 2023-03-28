export const ATLAS_PATH = "assets/atlas.png"
export const ATLAS_CELL_SIZE = 36
/** empty border around each cell manually added to the right and bottom borders, into atlas.png, in time of creation*/
const ATLAS_CELL_EMPTY_BORDER = 4
/** the area (inside the square cell) reserved for pixel filling*/
export const ATLAS_CELL_ART_SIZE = ATLAS_CELL_SIZE - ATLAS_CELL_EMPTY_BORDER

// TODO: consider alternatives (e.g. SVG animate and transform instead of viewBox)

/**
 * @param viewBox - the string, represents the value for the {@link SVGSVGElement.viewBox} which is the viewBox attribute of the svg image, fragment of which we plan to show on the screen.
 * The format is: "x y width height", where x and y are the coordinates of the top left corner of the viewBox.
 * @param flipX - if true, means the frame was flipped horizontally in time of creation.
 * An atlas.png was pre flipped horizontally, and the viewBox was calculated accordingly.
 * So later it will just affect the {@link SVGImageElement.transform} scale(X,...) attribute.
 * */
export type Frame = {
  viewBox: string
  flipX?: boolean
}

/**
 * get {@link Frame}({@link SVGSVGElement.viewBox} pixels area coordinates) from the atlas coordinates
 * @param col - column index of the cell in the atlas, starts from 0
 * @param row - row index of the cell in the atlas, starts from 0
 * @param width - width of the atlas rectangle area covered by frame pixels, default value is {@link ATLAS_CELL_ART_SIZE}
 * @param height - height of the atlas rectangle area covered by frame pixels, default value is {@link ATLAS_CELL_ART_SIZE}
 * @param flipX - if true, the frame will be flipped horizontally, default value is false
 * @returns the frame of type {@link Frame}, with precalculated {@link Frame.viewBox} property, based on the given parameters, and represented as string, to be used as the value of the {@link SVGSVGElement.viewBox} attribute.
 */
export const getFrame = (
  col: number,
  row: number,
  width: number = ATLAS_CELL_ART_SIZE,
  height: number = ATLAS_CELL_ART_SIZE,
  flipX = false
): Frame => {
  return {
    /** 
    if flipX is true, then atlas will be mirrored along X, relative to the left border.
    The number of column increased to 1, to make additional displacement to the left
    border of required frame inside mirrored atlas(using coordinates from original atlas).
    After that, the subtraction of the empty area of the frame(manually added to the atlas in time of creation), ({@link ATLAS_CELL_SIZE} - {@link width}) was added to the negatiated coordinates,
    to place viewBox to the left border of the pixel area of the frame,
    to prevent artefacts on screen. 
    */
    viewBox: flipX
      ? `${-(col + 1) * ATLAS_CELL_SIZE + ATLAS_CELL_SIZE - width} ${
          row * ATLAS_CELL_SIZE
        } ${width} ${height}`
      : `${col * ATLAS_CELL_SIZE} ${row * ATLAS_CELL_SIZE} ${width} ${height}`,
    flipX,
  }
}
