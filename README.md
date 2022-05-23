* p5 pixel grid constraint: https://editor.p5js.org/caevrobe/sketches/BjRhAYqQ5



## TODO:
### UI:
 * design home page
 * add active players window on canvas page
### Server:
 * add reconnect ability to websockets on client side
 * drop dead connections
 * use linear interpolation to fill in gaps between pixels when dragging mouse
   * determine if last pixel drag location (pmouseX, pmouseY) (snapped to pixel grid) is touching current location (snapped)
      * touching = Math.abs(lastX-currentX) == pixelsize or Math.abs(lastY-currentY) == pixelsize
      * use Bresenham's line algorithm
 * make canvas resize to fill page when window resized