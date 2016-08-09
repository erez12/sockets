console.log('starting ' + process.env.FOO);
require('http')
   .createServer((_, response) =>  response.end('hello 123'))
   .listen(process.env.PORT || 8080);
