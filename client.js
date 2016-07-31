"use strict"

const io = require('socket.io-client');
let socket = io.connect('http://127.0.0.1:8086', {
      transport: ['websocket'],
      pingTimeout: 100  * 1000,
      pingInterval: 40 * 1000
});
socket.io.timeout(1000)

// let sendMessageToServer = (socket, topic, content) => QOSMessage(socket)({topic: topic, content: content})
//       .then()
//       .catch(callback)
// }

socket.on('connect', function(){
    console.log('Connected to server !');
   //  setTimeout(() => {
   //    console.log('Sending message');
   //    sendMessageToServer(socket, 'client_message', {data: 123})
   //       .then(console.log)
   //       .catch(console.error);
   // }, 1000 * 5)
});

socket.on('server_message', function(message, ackFunction) {
   ackFunction(message.counter);
});

// Connection errors:
socket.on('disconnect', function(){
    console.log('disconnected!');
});

socket.on('reconnect', function(){
    console.log('reconnect');
});

socket.on('reconnecting', function(i){
    console.log('reconnecting', i);
});
socket.on('reconnect_failed', function(i){
    console.log('reconnect_failed');
});
