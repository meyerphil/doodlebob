const path = require('path');
const http = require('http');
const express = require('express');
const events = require('events');
const { WebSocketServer } = require('ws');


// global variable
var usersConnected = 0;
var userID = 0; // unique tag for user
var users = []; // holds id, name, color for each user connected
var idAddress = []; // ties user ip address to assigned id, don't want to share ip addresses to users
var tilesPlaced = []; // array that stores tiles placed
var prompts = ["Tiger", 
               "Car", 
               "Cat", 
               "Dog", 
               "Mailbox",
                "Chair",
               "Tree House",
               "Fruit",
               "Shoes",
               "Park",
               "Forest",
               "Beach",
            ]; // holds prompts/drawing ideas
var currentPrompt = "None currently.";

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
   's:prompt_request': sendPrompt,
   's:name_color_update': updateUser,
}

wss.on('connection', (ws, req) => {
   console.log(`${req.socket.remoteAddress}:${req.socket.remotePort} connected!`);
   usersConnected++;
   console.log(`${usersConnected} total user(s) connected!`);


   let toSend = JSON.stringify({ route: 'c:user_connected', data: { id: userID, 
      totalUsers: usersConnected} });
   console.log('Sent to all users: ${toSend}')
   wss.clients.forEach((client) => {
      if (req.postback || (client != ws))
         client.send(toSend);
   });

   ws.on('message', (data) => {
      data = JSON.parse(data);

      // todo add error response to client if route doesn't exist (maybe?)
      routes[data.route]?.(data.data, ws, req);
   });

   ws.on('close', () => {
      console.log(`  ${req.socket.remoteAddress}:${req.socket.remotePort} disconnected!`);
      usersConnected--;
      console.log(`${usersConnected} total user(s) connected!`);
      // remove user from list, first need to link the ip address with the assigned ID
      const userIDAIndex = idAddress.findIndex((userObj) => userObj.address === req.socket.remoteAddress+":"+req.socket.remotePort);
      const usersIndex = users.findIndex((userObj) => userObj.id === idAddress[userIDAIndex].id);
      

      let toSend = JSON.stringify({ route: 'c:user_disconnected', data: { id: users[usersIndex].id,
         totalUsers: usersConnected} });
      console.log(`Sent to all users: ${toSend}`);
      wss.clients.forEach((client) => {
         if (req.postback || (client != ws))
            client.send(toSend);
      });
      // remove the user from both lists
      users.splice(usersIndex,1);
      idAddress.splice(userIDAIndex,1);

      // send each client an updated users list
      toSend = JSON.stringify({ route: 'c:update_userList', data: {userList: users} });
      wss.clients.forEach((client) => {
         client.send(toSend);
      });

   });

});



/* Socket route handlers **********************************************************/

function ws_connected(data, sender) {

   // send to new user
   let toSend = JSON.stringify({ route: 'c:initialize', data: {
      totalUsers: usersConnected,
      uniqueID: userID} });
   sender.send(toSend); // send total user count

   userID++; // update to reflect a new unique user ID

   toSend = JSON.stringify({ route: 'c:new_prompt', data: {
      prompt: currentPrompt} });
   sender.send(toSend); // send current prompt

   
}

function getTiles(data, sender) {

   tilesPlaced.forEach((tileMessage) => { // send current board
      sender.send(tileMessage);
   });

}

function ws_placedTile(data, sender) {
   let toSend = JSON.stringify({ route: 'c:placed_tile', data});
   tilesPlaced.push(toSend); // store command in array
   
   //console.log("array:",tilesPlaced);
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

function sendPrompt(){
   // select random prompt
   currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
   console.log("Sending prompt: " + currentPrompt);
   tilesPlaced = [];
   let toSend = JSON.stringify({ route: 'c:new_prompt', data: {
                                 prompt: currentPrompt} });
   wss.clients.forEach((client) => {
         client.send(toSend);
   });
}

function updateUser(data, sender, req){
   //console.log(JSON.stringify(data));

   // check if user exists, then update name
   const foundIndex = users.findIndex((userObj) => userObj.id === data.id);
   //console.log("found: " + users[foundIndex]);
   if(foundIndex >= 0){
      users[foundIndex].name = data.name;
   } else{
   // else, add new user
      users.push({id:data.id, name:data.name, color:data.color});
      idAddress.push({address: req.socket.remoteAddress+":"+req.socket.remotePort,
                     id: data.id});
   }
   console.log("users:" + JSON.stringify(users));
   console.log("id and address:" + JSON.stringify(idAddress));

   // send each client an updated users list
   let toSend = JSON.stringify({ route: 'c:update_userList', data: {userList: users} });
   wss.clients.forEach((client) => {
      client.send(toSend);
   });
}