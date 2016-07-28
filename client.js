"use strict"

const io = require('socket.io-client');
const QOSMessage = require('socket.io-client');
let socket = io.connect('http://127.0.0.1:8086', {
      reconnect: true,
      transport: ['websocket'],
      pingTimeout: 100  * 1000,
      pingInterval: 40 * 1000
});


let sendMessageToServer = (socket, topic, content) => QOSMessage(socket)({topic: topic, content: content})
      .then()
      .catch(callback)


}

socket.on('connect', function(){
    console.log('Connected to server !');
    setTimeout(() => {
      console.log('Sending message');
      sendMessageToServer(socket, 'client_message', {data: 123})
         .then(console.log)
         .catch(console.error);
   }, 1000 * 5)
});

socket.on('server_message', function(message, ackFunction) {
   ackFunction(message.counter);
});

socket.on('disconnect', function(){
    console.log('disconnected!');
});
