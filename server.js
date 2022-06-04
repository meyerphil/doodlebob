const path = require('path');
const http = require('http');
const express = require('express');
const events = require('events');
const { WebSocketServer } = require('ws');


// global variable
var usersConnected = 0;
var tilesPlaced = []; // array that stores tiles placed


/* Server setup *******************************************************************/

const PORT = process.env.PORT || 7777;
const publicPath = path.join(__dirname, './public');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.use(express.static(publicPath));

// https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js
server.on('upgrade', (request, socket, head) => {
   wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
   });
});

server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}.`);
});



/* Event + socket handling ********************************************************/

let routes = {
   's:connected': ws_connected,
   's:placed_tile': ws_placedTile,
   's:get_tiles': getTiles,
   's:clear_pressed': clearTiles,
}

wss.on('connection', (ws, req) => {
   console.log(`${req.socket.remoteAddress} connected!`);
   usersConnected++;
   console.log(`${usersConnected} total user(s) connected!`);


<<<<<<< Updated upstream
   let toSend = JSON.stringify({ route: 'c:user_connected', data: { id: req.socket.remoteAddress } });
   console.log(`Sent to all users: ${toSend}`);
=======
   let toSend = JSON.stringify({ route: 'c:user_connected', data: { id: req.socket.remoteAddress, 
      totalUsers: usersConnected} });
   console.log('Sent to all users: ${toSend}')
>>>>>>> Stashed changes
   wss.clients.forEach((client) => {
      if (req.postback || (client != ws))
         client.send(toSend);
   });

   ws.on('message', (data) => {
      data = JSON.parse(data);

      // todo add error response to client if route doesn't exist (maybe?)
      routes[data.route]?.(data.data, ws);
   });

   ws.on('close', () => {
      console.log(`  ${req.socket.remoteAddress} disconnected!`);
<<<<<<< Updated upstream

      let toSend = JSON.stringify({ route: 'c:user_disconnected', data: { id: req.socket.remoteAddress } });
=======
      usersConnected--;
      console.log(`${usersConnected} total user(s) connected!`);
      
      let toSend = JSON.stringify({ route: 'c:user_disconnected', data: { id: req.socket.remoteAddress,
         totalUsers: usersConnected} });
>>>>>>> Stashed changes
      console.log(`Sent to all users: ${toSend}`);
      wss.clients.forEach((client) => {
         if (req.postback || (client != ws))
            client.send(toSend);
      });
   });

});



/* Socket route handlers **********************************************************/

function ws_connected(data, sender) {
   let toSend = JSON.stringify({ route: 'c:initialize', data: {
      totalUsers: usersConnected} });
   sender.send(toSend); // send total user count
}

function getTiles(data, sender) {

   tilesPlaced.forEach((tileMessage) => { // send current board
      sender.send(tileMessage);
   });

}

function ws_placedTile(data, sender) {
   let toSend = JSON.stringify({ route: 'c:placed_tile', data});
<<<<<<< Updated upstream
   //console.log(`Sent to all users: ${toSend}`);

=======
   tilesPlaced.push(toSend); // store command in array
   
   //console.log("array:",tilesPlaced);
>>>>>>> Stashed changes
   wss.clients.forEach((client) => {
      if (client != sender) {
         console.log('bruh');
         client.send(toSend);
      }
   });
}

function clearTiles() {
   console.log("clearing tiles");
   tilesPlaced = [];
   let toSend = JSON.stringify({ route: 'c:clear_tiles' });
   wss.clients.forEach((client) => {
         client.send(toSend);
   });
}