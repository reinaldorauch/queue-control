(function (document, io, undefined) {
  'use strict';

  const $ = x => document.querySelector(x);
  const senha = $('#senha');
  const guiche = $('#guiche');
  const bell = $('#bell');
  const socket = io({ transports: ['websocket'], upgrade: false });

  socket.on('update-queue', ({ counter, mesa }) => {
    senha.innerText = counter;
    guiche.innerText = mesa;
    restartCallSound();
  });

  function restartCallSound() {
    if (!bell.paused) {
      bell.pause();
    }

    if (bell.paused && bell.currentTime > 0) {
      bell.currentTime = 0;
    }

    bell.play();
  }
})(document, io);
