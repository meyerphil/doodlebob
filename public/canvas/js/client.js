let scheme = 'ws';

if (location.protocol === 'https:')
   scheme = 'wss';

let ws = new WebSocket(`${scheme}://${location.host}`);

const users = new Set();

/* Basic websocket handling *******************************************************/
ws.onopen = () => {
   console.log('Websocket opened...');
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
}

ws.onmessage = function(event) {
   let msg = JSON.parse(event.data);
   //console.log('Message:', msg);

   routes[msg.route]?.(msg.data);
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

function userConnected(event) {
   let data = event.data;

   console.log(`${data.id} connected!`);
}

function userDisconnected(event) {
   let data = event.data;

   console.log(`  ${data.id} disconnected!`);
}

function ws_placedTile(data) {
   //let data = JSON.parse(event.data);
   /* console.log('placed tile from server');
   console.log(data); */
   addTile(data, true);
}