"use strict"

const SEC = 1000;
const MIN = 60 * SEC;
const io = require('socket.io-client');
const serverUrl = 'http://socket-server-2.herokuapp.com/';//'http://127.0.0.1:8086'
let messageCounter = 1;
let sendMessage = (socket, topic, content, ack) => socket.emit(topic, content, ack);

function onFirstConnect(socket) {
   setInterval(() => {
      return;
     console.log('Sending message', messageCounter);
     sendMessage(socket, 'client_message', {messageCounter: messageCounter++}, (msgCount) => {
        console.log("got ACK for message " + msgCount);
     });
  }, 5 * SEC);
}

function createSocket(){
   let socket = io(serverUrl, {
      forceNew: true,
      reconnectionAttempts: 5,
      transport: ['websocket']
   });

   socket.__meta = {
      reconnectCounter: 0,
      reconnectionAttempts: 0
   };
   socket.on('connect', function(){
      if (socket.__meta.reconnectCounter > 0){
         console.log('after-reconnect');
         return
      }

      console.log('connect');
      onFirstConnect(socket);
   });

   socket.on('server_message', function(message, ackFunction) {
      console.log('got message no.', message.messageCounter);
      ackFunction && ackFunction(message.counter);
   });

   // Connection errors:
   socket.on('disconnect', function(){
       console.log('disconnect', socket.__meta);
   });

   socket.on('reconnect', function(){
      socket.__meta.reconnectCounter++
      console.log('reconnect', socket.__meta);
   });

   socket.on('reconnecting', function(i){
      socket.__meta.reconnectionAttempts = i;
      console.log('reconnecting', i);
   });
   socket.on('reconnect_failed', function(i){
       console.log('reconnect_failed', socket.__meta);
   });

   return
}
createSocket();
