for (var i = 1; i <= parseInt(process.env.CLIENTS); i++) {
   var outFile = 'client_' + i + '.out'
   var command = 'touch ' + outFile + ';CLIENT_ID=' + i + ' node client.js >' + outFile;
   p = require('child_process').exec(command, function (error, stdout, stderr) {
      console.log(error);
   });
}
   //  export STORM_USER_DATA_BASE_PATH=/opt/')+normalize(';node '+BASE_PATH+'injector_mdrv/app.js > /opt/injector_mdrv/injector.out --cfgFile=/opt/injector_mdrv/etc/storm.json --max-old-space-size=5120 --silent'),
