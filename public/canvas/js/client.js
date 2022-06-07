let scheme = 'ws';

if (location.protocol === 'https:')
   scheme = 'wss';

let ws = new WebSocket(`${scheme}://${location.host}`);

const users = new Set();
var userID = null;


/* Basic websocket handling *******************************************************/
ws.onopen = () => {
   console.log('Websocket opened...');
   sendMessage("s:connected",""); // fetch data from server to initalize
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
   'c:clear_tiles': clearMessage,
   'c:new_prompt': newPrompt,
   'c:update_userList': updateUserList,
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

function userConnected(data) {

   console.log(`id:${data.id} connected!`);
   console.log(`${data.totalUsers} user(s) online!`);
   $("#users").html(`${data.totalUsers} user(s) online!`); // update user count
}

// when joining, run data sent from server
function initialize(data){
   console.log(`${data.totalUsers} user(s) online!`);
   $("#users").html(`${data.totalUsers} user(s) online!`); // update user count
   userID = data.uniqueID;
   console.log(`${data.uniqueID} is your unique ID to the server`);
   sendMessage("s:get_tiles",""); // fetch existing tile data

   nameColorUpdate(); // send name and color to server
}

async function nameColorUpdate(){
   try{
   sendMessage("s:name_color_update", {id:userID, name:username, color: colorRGB});// send name & color to server
   } catch { // retry after 1 sec
      setTimeout(function(){
         nameColorUpdate();
     },1000);
   }
}

function userDisconnected(data) {

   console.log(`id:${data.id} disconnected!`);
   console.log(`${data.totalUsers} user(s) online!`);
   $("#users").html(`${data.totalUsers} user(s) online!`); // update user count
}

function ws_placedTile(data) {
   //let data = JSON.parse(event.data);
   /* console.log('placed tile from server');
   console.log(data); */
   addTile(data, true);
}

function clearMessage(){
   clearTiles(); // from general.js
}

function newPrompt(data){
   console.log(`${data.prompt} given as new prompt`);
   $("#prompt").html(`Your prompt is: ${data.prompt}`); // update prompt
}

function updateUserList(data){
   console.log("user list:" + JSON.stringify(data.userList));
   $('#userList').html(""); // clear list
   data.userList.forEach((user) => {
      if(user.id !== userID){
         $('#userList').append("<li id = '" + user.id + "'>"+user.name+"</li>");
         $(`#${user.id}`).css("color", 'rgba('+user.color.r+','+user.color.g+','+user.color.b+',1)');
      }
   });
}