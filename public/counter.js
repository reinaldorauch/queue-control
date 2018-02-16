(function (document, io, undefined) {
  'use strict';

  const $ = x => document.querySelector(x);
  const senha = $('#senha');
  const guiche = $('#guiche');
  const bell = $('#bell');
  const body = $('body');
  const lastCalls = $('#tabela-historico > tbody');
  const socket = io({ transports: ['websocket'], upgrade: false });

  socket.on('update-queue', ({ counter, mesa }) => {
    senha.innerText = counter;
    guiche.innerText = mesa;
    restartCallSound();
    blink(body);
  });

  socket.on('update-history', updateHistory);

  function updateHistory(history) {
    lastCalls.innerHTML = history.map(createHistoryLi).join('');
  }

  function createHistoryLi({ counter, mesa, timestamp }) {
    timestamp = timestamp ? (new Date(timestamp)).toLocaleTimeString() : '';
    return `<tr><td>${counter}</td><td>${mesa}</td><td>${timestamp}</td></tr>`;
  }

  function restartCallSound() {
    if (!bell.paused) {
      bell.pause();
    }

    if (bell.paused && bell.currentTime > 0) {
      bell.currentTime = 0;
    }

    bell.play();
  }

  function toggleClass(e, klass) {
    if (e.className.indexOf(klass) != -1) {
      e.className = e.className
        .split(/\s+/)
        .filter((c) => c !== klass)
        .join(' ');
    } else {
      e.className += ` ${klass}`;
    }
  }

  function blink(e) {
    const interval = setInterval(() => {
      toggleClass(e, 'invert');
    }, 200);
    setTimeout(() => clearInterval(interval), 2000);
  }
})(document, io);
