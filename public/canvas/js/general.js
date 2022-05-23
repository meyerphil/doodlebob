function setup() {
   //sz1 = 700; // canvas size
   sz = 5; // pixel size
   p_scale = 4;

   createCanvas(windowWidth, windowWidth);
   noStroke();
   fill(0);

   background(0);

   c_placed = color(randomColor(), randomColor(), randomColor());
   c_preview = color(0, 0, 0, 127);
}

function randomColor() {
   return Math.floor(Math.random() * 256);
}

function calculateCoords(mouseX, mouseY) {
   return {
      x: Math.ceil((mouseX-sz*p_scale/2) / sz) * sz,
      y: Math.ceil((mouseY-sz*p_scale/2) / sz) * sz,
   }
}

async function addTile(coords, from_server = false) {
   let str = coords.x + ',' + coords.y;

   if (!from_server) {
      coords.color = c_placed.levels;
      fill(c_placed);
      sendMessage('s:placed_tile', coords);
   } else {
      fill(color(coords.color));
   }
   
   //rect(coords.x, coords.y, sz*5, sz*5);
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

let scale = 10;
let freq  = 50

let int = null;
function haha() {
   if (int)
      clearInterval(int);

   let colors = [];

   for (let i = 0; i < 3; i++) {
      let sign = Math.random() < 0.5 ? -1 : 1;

      let color = randomColor();
      let delta = Math.round((Math.random())*scale);
      let dir = delta * sign;
      colors.push({color: color, delta: delta, dir: dir});
   }

   console.log(colors);

   int = setInterval(() => {
      for (let i = 0; i < colors.length; i++) {
         let c = colors[i];

         if ((c.color >= 255-c.delta && c.dir > 0) || (c.color <= 0+c.delta && c.dir < 0))
            colors[i].dir *= -1

         colors[i].color+=colors[i].dir;
      }

      c_placed = color(colors[0].color, colors[1].color, colors[2].color, 255);
   }, freq);
}