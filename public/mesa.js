(function (document, io, undefined) {
  'use strict';

  const senha = document.querySelector('#senha');
  const call = document.querySelector('#call');
  const reset = document.querySelector('#reset');

  const socket = io({ transports: ['websocket'], upgrade: false });

  socket.on('update-queue', function (queue) {
    console.log('Received update queue', queue);
    senha.innerText = queue;
  });

  call.addEventListener('click', () => socket.emit('request-update-queue'));
  reset.addEventListener('click', () => socket.emit('reset'));

})(document, io);
