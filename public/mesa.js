(function (document, io, undefined) {
  'use strict';

  const LOCALSTORAGE_ULTIMA_MESA = 'mesa';

  const $ = x => document.querySelector(x);
  const senha = $('#senha');
  const mesaOrigem = $('#mesa-origem');
  const call = $('#call');
  const reset = $('#reset');
  const mesa =  $('#mesa');
  const mesaVal = () => mesa.value;

  const socket = io({ transports: ['websocket'], upgrade: false });

  socket.on('update-queue', function (queue) {
    senha.innerText = queue.counter;
    mesaOrigem.innerText = queue.mesa;
  });

  call.addEventListener('submit', e => {
    const guiche = mesaVal();
    e.preventDefault();
    localStorage.setItem(LOCALSTORAGE_ULTIMA_MESA, guiche);
    socket.emit('request-update-queue', guiche);
  });
  reset.addEventListener('click', () => socket.emit('reset'));

  document.addEventListener('readystatechange', () => {
    mesa.value = localStorage.getItem(LOCALSTORAGE_ULTIMA_MESA);
  });

})(document, io);
