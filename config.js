'use strict'

const SEC = 1000;
const MIN = 60 * SEC;

const SOCKET_SERVER_CONFIG = {
   serveClient: false,
   pingTimeout: 2 * MIN,
   pingInterval: 40 * 1000,
   perMessageDeflate: false,
   transports: ['websocket']
};

const SOCKET_CLIENT_CONFIG = {
   forceNew: true,
   reconnection: false,
   reconnectionAttempts: 0,
   transports: ['websocket']
};

// EREZ - Using module and not JSON to make sure imutabiliy of the data
module.exports = function () {
   return {
      socketIOServer: SOCKET_SERVER_CONFIG,
      socketIOclient: SOCKET_CLIENT_CONFIG
   };
};
