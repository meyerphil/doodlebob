function setup() {
   //sz1 = 700; // canvas size
   sz = 20; // pixel size

   createCanvas(windowWidth, windowWidth);
   noStroke();
   fill(0);

   background(204);

   c_placed = color(randomColor(), randomColor(), randomColor());
   c_preview = color(0, 0, 0, 127);
}

function randomColor() {
   return Math.floor(Math.random() * 256);
}

function calculateCoords(mouseX, mouseY) {
   return {
      x: Math.ceil((mouseX - sz) / sz) * sz,
      y: Math.ceil((mouseY - sz) / sz) * sz,
   }
}

let placed = {};
let lastPlaced = {};
async function addTile(coords, from_server = false) {
   let str = coords.x + ',' + coords.y;

   let isNew = !placed.hasOwnProperty(str);

   placed[str] = coords;

   if (!from_server && isNew) {
      sendMessage('s:placed_tile', coords);
      lastPlaced = coords;
   }

   fill(c_placed);
   rect(coords.x, coords.y, sz, sz);
}

function mouseClicked() {
   let coords = calculateCoords(mouseX, mouseY);

   addTile(coords);
}

let last = {};
async function mouseDragged() {
   let coords = calculateCoords(mouseX, mouseY);
   let pcoords = last;

   let diffX = coords.x - pcoords.x;
   let diffY = coords.y - pcoords.y;

   if (Math.abs(diffX) > sz || Math.abs(diffY) > sz) {
      let px = pcoords.x;
      let py = pcoords.y;

      let x = coords.x;
      let y = coords.y;

      // bresenham algorithm stolen from github https://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
      var dx = Math.abs(px - x);
      var dy = Math.abs(py - y);
      var sx = (x < px) ? sz : -sz;
      var sy = (y < py) ? sz : -sz;
      var err = dx - dy;

      while (true) {
         addTile({ x: x, y: y });

         if ((x === px) && (y === py)) break;
         var e2 = 2 * err;
         if (e2 > -dy) { err -= dy; x += sx; }
         if (e2 < dx) { err += dx; y += sy; }
      }
   }

   addTile(coords);
   last = coords;
}

function mouseReleased() {
   last = {};
}


function draw() { }