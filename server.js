"use strict"

require('console-stamp')(console, '[HH:MM:ss.l]');
const SEC = 1000;
const MIN = 60 * SEC;


console.log('Server running on port ');
var httpServ = require('http').createServer((req, res) => {
   res.end("What are you doing here ? Go back to your socket !");
});

var io = require('socket.io').listen(httpServ, require('./config.js')().socketIOServer);
httpServ.listen(8080);

var clientsMessegesCounts = {}
var messageToClients = (function (){
   var _notifyFunction = null;
   return {
      send: (msgName, msg) => {
         if (!_notifyFunction) {
            return false;

         }
         console.log('sending message ' + msg.messageCounter);
         _notifyFunction(msgName, msg);
         return true;
      },
      setNotifyFunction: (func) => { _notifyFunction = func; }
   };
}());

function testMessageRange(a) {
	var known = [];
	var lastKnown = 0;
	for (var i = 1; i < a.length; i++){
		if (a[i] !== a[i - 1] + 1) {
			known.push([a[lastKnown], a[i -1]]);
			lastKnown = i;
		}
	}

	known.push([a[lastKnown], a[a.length - 1]]);

	return known
}

function testClientsRecivedMessages(){
   var now = new Date().getTime();
   var printInterval = 1 * SEC

   testClientsRecivedMessages._lastPrint = testClientsRecivedMessages._lastPrint || (now - printInterval)
   if (now < testClientsRecivedMessages._lastPrint + printInterval) {
      return;
   }
   console.log(Object.keys(clientsMessegesCounts).map((clientID) => {
      return clientID + ": " + JSON.stringify(testMessageRange(clientsMessegesCounts[clientID]));
   }).join('\t'));

   testClientsRecivedMessages._lastPrint = now;
}

io.on('connection', function (socket) {
   console.log("connection");

    socket.on('register', function (message, ackFunction) {
      clientsMessegesCounts[message.clientID] = clientsMessegesCounts[message.clientID] || [];
      ackFunction && ackFunction();
   });
    socket.on('client_message', function (message, ackFunction) {
      console.log(socket.id);
      if (message.clientID == 1)  {
         testClientsRecivedMessages()
      }
      clientsMessegesCounts[message.clientID] = clientsMessegesCounts[message.clientID] || [];
      clientsMessegesCounts[message.clientID].push(message.messageCounter);
      ackFunction && ackFunction(message.messageCounter);
    });

    socket.on('disconnect', function () {
        console.log('disconected');
    });

    messageToClients.setNotifyFunction(function(msgName, msg) {
       socket.broadcast.emit(msgName, msg); // everyone else
       socket.emit(msgName, msg); // current socket
    });
});

var messageCounter = 1;
setInterval(() => {
   return;
   if (messageToClients.send('server_message', {messageCounter: messageCounter})){
      messageCounter++
   }

}, 1 * SEC);
