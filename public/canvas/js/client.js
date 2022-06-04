let scheme = 'ws';

if (location.protocol === 'https:')
   scheme = 'wss';

let ws = new WebSocket(`${scheme}://${location.host}`);

const users = new Set();


/* Basic websocket handling *******************************************************/
ws.onopen = () => {
   console.log('Websocket opened...');
   sendMessage("s:connected",""); // fetch data from server to initalize
   sendMessage("s:get_tiles",""); // fetch existing tile data
}

ws.onerror = (err) => {
   console.warn("ERROR???", err);
}

ws.onclose = () => {
   console.log('Websocket closed.');
   ws = null;
}



/* Websocket routing **************************************************************/

let routes = {
   'c:user_connected': userConnected,
   'c:user_disconnected': userDisconnected,
   'c:placed_tile': ws_placedTile,
   'c:initialize': initialize,
   'c:clear_tiles': clear,
}

ws.onmessage = function(event) {
   let msg = JSON.parse(event.data);
   console.log('Message:', msg);

   routes[msg.route]?.(msg);
}

/**
 * Sends a message to the server
 * @param {string} route - the server-side route message should be sent to
 * @param {Object} dataObj - data object including necessary information for destination route handler 
 */
async function sendMessage(route, dataObj) {
   let msg = `{"route": "${route}", "data": ${JSON.stringify(dataObj)}}`;

   ws?.send(msg);
}

function userConnected(data) {

   console.log(`${data.id} connected!`);
   console.log(`${data.totalUsers} user(s) online!`);
   $("#users").html(`${data.totalUsers} user(s) online!`); // update user count
}

// when joining, run data sent from server
function initialize(data){
   console.log(`${data.totalUsers} user(s) online!`);
   $("#users").html(`${data.totalUsers} user(s) online!`); // update user count
}

function userDisconnected(data) {

   console.log(`  ${data.id} disconnected!`);
   console.log(`${data.totalUsers} user(s) online!`);
   $("#users").html(`${data.totalUsers} user(s) online!`); // update user count
}

function ws_placedTile(event) {
   //let data = JSON.parse(event.data);
   /* console.log('placed tile from server');
   console.log(data); */
   addTile(data, true);
}

function clear(){
   clearTiles(); // from general.js
}