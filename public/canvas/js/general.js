var sz = 5;        // pixel size
var p_scale = 3;   // visual pixel scaling factor

let intID = null;  // JS interval ID
var freq  = 50     // ms interval for color changing 
var c_scale = 10;  // max amount of color change per interval 
var colors = null; // array used for color changing



function setup() {
   createCanvas(windowWidth, windowWidth);
   noStroke();
   background(0);

   c_placed = color(randomColor(), randomColor(), randomColor());
   c_preview = color(0, 0, 0, 127);
}


// returns random color component from [0, 255]
const randomColor = () => Math.floor(Math.random() * 256);

// calculates mouse coordinates constrained to a grid of pixels of size
const calculateCoords = (mouseX, mouseY) => ({
   x: Math.ceil((mouseX-sz*p_scale/2) / sz) * sz, 
   y: Math.ceil((mouseY-sz*p_scale/2) / sz) * sz
});


async function addTile(coords, from_server = false) {
   if (!from_server) {
      coords.color = c_placed.levels;
      fill(c_placed);
      sendMessage('s:placed_tile', coords);
   } else {
      fill(color(coords.color));
   }
   
   rect(coords.x, coords.y, sz*p_scale, sz*p_scale);
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

      // bresenham algorithm stolen from https://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
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



document.addEventListener('keydown', cheatCode);

let code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
let idx = 0;
function cheatCode(e) {
   idx = (e.key.toUpperCase() === code[idx].toUpperCase()) ? idx+1 : 0;

   if (idx == code.length) {
      haha();
      document.removeEventListener('keydown', cheatCode); // arguments.callee
   }
}


function haha() {
   if (intID)
      clearInterval(intID);
   
   if (!colors) {
      colors = [];
      for (let i = 0; i < 3; i++) {
         let sign = Math.random() < 0.5 ? -1 : 1;
   
         let color = randomColor();
         let delta = Math.round((Math.random())*c_scale);
         let dir = delta * sign;
         colors.push({color: color, delta: delta, dir: dir});
      }
   }

   intID = setInterval(() => {
      for (let i = 0; i < colors.length; i++) {
         let c = colors[i];

         if ((c.color >= 255-c.delta && c.dir > 0) || (c.color <= 0+c.delta && c.dir < 0))
            colors[i].dir *= -1

         colors[i].color+=colors[i].dir;
      }

      c_placed = color(colors[0].color, colors[1].color, colors[2].color, 255);
   }, freq);
}