# doodlebob
This project is a collaborative canvas, allowing users to draw together in realtime. Made for ART101 at UCSC, S22. [Click here to go to the live site.](https://doodlebob-art101.herokuapp.com/)

 - [Usage](#usage)
 - [Todo](#todo)

 <br>



## Usage
<b>Requirements:</b> Node.js

Before starting the server for the first time, run ```npm install``` to install dependent packages.
Run ```npm start``` to start the server locally.


<br>

## Todo:
### UI:
 * design home page
 * add active players window on canvas page
 * add second transparent canvas on top of main canvas to preview brush size
   * https://editor.p5js.org/caevrobe/sketches/OYbGZhX1t
   * pixel grid constraint: https://editor.p5js.org/caevrobe/sketches/BjRhAYqQ5
 * set canvas rendering to pixelated
 * make canvas resize to fill page when window resized without clearing it (use graphics buffer);
   * https://stackoverflow.com/questions/47694631/p5-resize-window-without-clearing-the-background
 * change general.js p_scale based on velocity (maybe?) (would need to add p_scale to server messages)

### Server:
 * add reconnect ability to websockets on client side
 * drop dead connections