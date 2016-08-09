var SEC = 1000;
var MIN = 60 * SEC;

console.log('Server running on port ' + process.env.PORT);
var io = require('socket.io')(process.env.PORT || 8086, {
      serveClient: false,
      pingTimeout: 10 * MIN,
      transport: ['websocket']
});

var messageToClients = (function (){
   var _notifyFunction = null;
   return {
      send: (msgName, msg) => {
         if (!_notifyFunction) {
            return;

         }
         console.log('sending message ' + msg.messageCounter);
         _notifyFunction(msgName, msg);
      },
      setNotifyFunction: (func) => { _notifyFunction = func; }
   };
}());
io.on('connection', function (socket) {
    console.log('connection');

    socket.on('client_message', function (message, ackFunction) {
      console.log('got message no.', message.messageCounter);
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
   messageToClients.send('server_message', {messageCounter: messageCounter++});
}, 5 * SEC);
