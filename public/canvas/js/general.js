function setup() {
   //sz1 = 700; // canvas size
   sz = 20; // pixel size

   createCanvas(windowWidth, windowHeight);
   noStroke();
   fill(0);

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
function addTile(x, y, from_server=false) {
   let coords = calculateCoords(x, y);
   let str = coords.x + ',' + coords.y;

   let isNew = !placed.hasOwnProperty(str);

   placed[str] = coords;

   if (!from_server && isNew) {
      sendMessage('s:placed_tile', coords);
   }
}

function mouseClicked() {
   addTile(mouseX, mouseY);
}

function mouseDragged() {
   addTile(mouseX, mouseY);
}

function draw() {
   background(204);

   let { x, y } = calculateCoords(mouseX, mouseY);

   fill(c_placed);

   for (const tile in placed) {
      let c = placed[tile];
      rect(c.x, c.y, sz, sz);
   }


   fill(c_preview);
   rect(x, y, sz, sz)
}