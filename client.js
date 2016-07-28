//client.js
var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:8086', {
      reconnect: true,
      transport: ['websocket'],
      pingTimeout: 100  * 1000,
      pingInterval: 40 * 1000
});
socket._messages = {};
socket._messageCount = 0;

function
function sendMessageToServer(socket, name, content){
   socket._messages[socket._messageCount] = {
      content: content,
      sent: Date.now(),


   socket.emit(name, content, function(messageIndex){
      console.log('got message ' + messageIndex);
   });
}

socket.on('connect', function(){
    console.log('Connected to server !');
    setTimeout(() => {
      sendMessageToServer(socket, 'client_message', )
   })
});

socket.on('server_message', function(message, ackFunction) {
   ackFunction(message.counter);
});

socket.on('disconnect', function(){
    console.log('disconnected!');
});
