(function (document, io, undefined) {
  'use strict';

  const senha = document.querySelector('#senha');
  const bell = document.querySelector('#bell');
  const socket = io({ transports: ['websocket'], upgrade: false });

  socket.on('update-queue', queue => {
    console.log('Received update queue', queue);
    senha.innerText = queue;
    restart();
  });

  function restart() {
    if (!bell.paused) {
      bell.pause();
    }

    if (bell.paused && bell.currentTime > 0) {
      bell.currentTime = 0;
    }

    bell.play();
  }
})(document, io);
