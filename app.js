console.log('starting');
require('http')
   .createServer((_, response) =>  response.end('hello'))
   .listen(process.env.PORT || 8080);
