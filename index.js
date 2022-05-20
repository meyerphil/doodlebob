const path = require('path');
const http = require('http');
const express = require('express');
const events = require('events');
const { WebSocketServer } = require('ws');




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
// todoo