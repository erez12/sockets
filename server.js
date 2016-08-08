var SEC = 1000;
var MIN = 60 * SEC;

var io = require('socket.io')({
      serveClient: false,
      pingTimeout: 20 * SEC,
      pingInterval: 5 * SEC
});
//    {
//    serveClient: false,
//    transport: ['websocket'],
//    pingTimeout: 100  * 1000,
//    pingInterval: 40 * 1000
// });

io.listen(8086);
function sendMessageToClient(socket, name, content){
   socket.emit(name, content, function(messageIndex){
      console.log('got message ' + messageIndex);
   });
}

io.on('connection', function (socket) {
    console.log('connection');

    socket.on('client_message', function (message, ackFunction) {
      console.log('got message no.', message.messageCounter);
      ackFunction && ackFunction(message.messageCounter);
    });

    socket.on('disconnect', function () {
        console.log('disconected');
    });

   //  setTimeout(() => {
   //    try {
   //       console.log('try disconnect');
   //       socket.disconnect(true);
   //    }catch(e) {
   //       console.log(e.message);
   //    }
   // }, 1000 * 3);
});
