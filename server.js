var SEC = 1000;
var MIN = 60 * SEC;

console.log('Server running on port ' + process.env.PORT);
var io = require('socket.io')(process.env.PORT || 8086, {
      serveClient: false,
      pingTimeout: 20 * SEC,
      transport: ['websocket']
});

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
var clientsMessegesCounts = {}
function testMessages (a){
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
setInterval(function () {
   var diffs = Object.keys(clientsMessegesCounts).forEach((clientID) => {
      console.log(clientID, testMessages(clientsMessegesCounts[clientID]));
   });
}, 1000 * 10);

var connectionCount = 0;
io.on('connection', function (socket) {
    console.log('connection');
    connectionCount++;
    socket.on('register', function (message, ackFunction) {
      clientsMessegesCounts[message.clientID] = clientsMessegesCounts[message.clientID] || [];
      ackFunction && ackFunction();
   });
    socket.on('client_message', function (message, ackFunction) {
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
