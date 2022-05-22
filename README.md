* p5 pixel grid constraint: https://editor.p5js.org/caevrobe/sketches/BjRhAYqQ5



## TODO:
 * add reconnect ability to websockets on client side
 * drop dead connections
 * use linear interpolation to fill in gaps between pixels when dragging mouse
   * determine if last pixel drag location (pmouseX, pmouseY) (snapped to pixel grid) is touching current location (snapped)
      * touching = Math.abs(lastX-currentX) == pixelsize or Math.abs(lastY-currentY) == pixelsize