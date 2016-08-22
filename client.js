"use strict"

require('console-stamp')(console, '[HH:MM:ss.l]');
const SEC = 1000;
const MIN = 60 * SEC;
const io = require('socket.io-client');
const serverUrl = 'http://54.152.194.77:35357'
let messageCounter = 1;
let sendMessage = (socket, topic, content, ack) => socket.emit(topic, content, ack);

function onFirstConnect(socket) {
   setInterval(() => {
     console.log('Sending message ' + messageCounter);
     sendMessage(socket, 'client_message', {clientID: socket.__meta.clientID, messageCounter: messageCounter++}, (msgCount) => {
        console.log("got ACK for message " + msgCount);
     });
  }, 1 * SEC);
}

var serverMessageCount = [];
setInterval(() => { console.log(JSON.stringify(serverMessageCount)); }, 1000 * 10);
function createSocket(clientID){
   let socket = io(serverUrl, require('./config.js')().socketIOclient);

   socket.__meta = {
      reconnectCounter: 0,
      reconnectionAttempts: 0,
      clientID: clientID
   };
   socket.on('connect', function(){
      socket.__me
      if (socket.__meta.reconnectCounter > 0){
         console.log('after-reconnect');
         return
      }

      console.log('connect');
      sendMessage(socket, "register", {clientID: clientID}, function(){
         onFirstConnect(socket);
      });
   });

   socket.on('server_message', function(message, ackFunction) {
      serverMessageCount.push(message.messageCounter)
      ackFunction && ackFunction(message.messageCounter);
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
   socket.on('connect_error', (e)=> {console.errore()});

   return
}
console.log('starting ' + process.env.CLIENT_ID);
createSocket(process.env.CLIENT_ID);
