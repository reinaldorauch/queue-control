(function (document, io, undefined) {
  'use strict';

  const $ = x => document.querySelector(x);
  const senha = $('#senha');
  const mesaOrigem = $('#mesa-origem');
  const call = $('#call');
  const reset = $('#reset');
  const mesa = () => $('#mesa').value;

  const socket = io({ transports: ['websocket'], upgrade: false });

  socket.on('update-queue', function (queue) {
    console.log('Received update queue', queue);
    senha.innerText = queue.counter;
    mesaOrigem.innerText = queue.mesa;
  });

  call.addEventListener('submit', e => {
    e.preventDefault();
    socket.emit('request-update-queue', mesa());
  });
  reset.addEventListener('click', () => socket.emit('reset'));

})(document, io);
