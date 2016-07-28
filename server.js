var io = require('socket.io')({
   serveClient: false,
   transport: ['websocket'],
   pingTimeout: 100  * 1000,
   pingInterval: 40 * 1000
});

io.listen(8086);
function sendMessageToClient(socket, name, content){
   socket.emit(name, content, function(messageIndex){
      console.log('got message ' + messageIndex);
   });
}

io.on('connection', function (socket) {
    console.log('Server recived client connection');

    socket.on('client_message', function (from, msg, ackFunction) {
        ackFunction()
    });

    socket.on('disconnect', function () {
        console.log('disconected');
    });
});
