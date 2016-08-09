console.log('starting ' + process.env.SOCK_SERVER);
if (process.env.SOCK_SERVER) {
   console.log('starting server');
   var _ = require('./server.js');
}
// require('http')
//    .createServer((_, response) =>  response.end('hello 123'))
//    .listen(process.env.PORT || 8080);
