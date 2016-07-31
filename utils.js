"use strict"

let not = (fn) => function() { return !fn.apply(this, arguments); }; // EREZ - arguments not supported in lambda...
let s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
let guid = () => [s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');

module.exports.initQOS = function initQOS(QOSsocket, messageName, messageContent) {
   socket._messages = {};
   socket._messageCount = 0;
};
module.exports.addMessageQOS = function addMessageQOS(QOSsocket, messageName, messageContent) {
   if (socket._messages[socket._messageCount]){
      return;
   }

   socket._messages[socket._messageCount++] = {
      content: content,
      sentTime: Date.now(),
      resolved: false
   };
};
module.exports.removeMessageQOS = function removeMessageQOS(sQOSocket, messageId) {
   socket._messages[messageId].resolved = true;

};
module.exports.sendMessage = function sendMessage(QOSsocket, messageName, messageContent) {
   socket.emit(messageName, messageContent, function(messageIndex){
      console.log('got message ' + messageId);

   });
};


let isMessageResolved = (message) => !!message.resolved;
let isDeltaTimePassed = (message, delta) => Date.now() > message.sentTime + delta;
let isResendLimitReached = (message, resendLimit) => message.resendCounter > resendLimit

let isMessageResendDeltaPassed = (message, resendDelta) => not(isMessageResolved)(message) && isDeltaTimePassed(message, resendDelta);
let isMessageNeedResend = (message, resendDelta, resendLimit) => isMessageResendDeltaPassed(message, resendDelta) && not(isResendLimitReached)(message, resendLimit);
let isMessageOverdue = (message, resendDelta, resendLimit) => isMessageResendDeltaPassed(message, resendDelta) && isResendLimitReached(message, resendLimit);

module.exports.monitorSentMessages = function monitorSentMessages(QOSsocket, resendDelta, retryCount) {
   let resolvedMessages = QOSsocket._messages.filter(isMessageResolved);
   let overdueMessages = QOSsocket._messages.filter(isMessageOverdue);
   let resendMessages = QOSsocket._messages.filter(isMessageNeedResend);

   resendMessages.forEach(resendMessages);
   resolvedMessages.forEach( (me) => );

   // TODO - overdueMessages what to do ?
};
let createMessageMeta = () => {
    return {
        id: guid(),
        resendCounter: -1
        resolved: false
    };
};
function sendMessage(socket, message){
   new Promise((resolve, reject) => {
      if (!socket || !message || !message.topic) {
         reject(new Error('invalid argument'));
         return;
      }

      message.__meta = messageColne.__meta || createMessageMeta();
      if (message.resolved) {

      }
      messageColne.__meta.resendCounter++;
      socket.emit(messageName, messageContent, function(messageIndex){
         console.log('got message ' + messageId);

      });

      // 2. Add message meta
      // 3. Try sending
   });

}

module.exports.QOSMessage = (socket) => (message) => sendMessage(socket, message);
