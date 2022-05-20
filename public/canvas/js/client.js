let ws = new WebSocket(`ws://${location.host}`);

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
}

ws.onmessage = function(event) {
   let data = JSON.parse(event.data);
   console.log(data);

   routes[data.route](data);
}

function userConnected(event) {
   let data = event.data;

   console.log(`${data.id} connected!`);
}

function userDisconnected(event) {
   let data = event.data;

   console.log(`  ${data.id} disconnected!`);
}