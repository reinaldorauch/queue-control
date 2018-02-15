const { EventEmitter } = require('events');
const fs = require('fs');

const QUEUE_FILENAME = `${__dirname}/../queue.json`;

class Queue extends EventEmitter {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.counter = 0;
    this.mesa = '';
    this.timestamp = new Date();
  }

  reset() {
    this.set({});
  }

  next(mesa) {
    this.set({ counter: this.counter + 1, mesa });
  }

  set({ counter = 0, mesa = '', timestamp = new Date() }, options = { propagate: true }) {
    this.counter = counter;
    this.mesa = mesa;
    this.timestamp = timestamp;

    if (options.propagate) {
      this.emit('update');
      this.save();
    }
  }

  save() {
    try {
      const { counter, mesa, timestamp } = this;
      const file = JSON.stringify({ counter, mesa, timestamp });
      fs.writeFileSync(QUEUE_FILENAME, file);
    } catch (e) {
      console.error(e);
    }
  }

  loadIfExists() {
    if (fs.existsSync(QUEUE_FILENAME)) {
      try {
        this.set(JSON.parse(fs.readFileSync(QUEUE_FILENAME)), { propagate: false });
      } catch(e) {
        console.error(e.stack);
      }
    }
  }
};

module.exports = {
  Queue,
  QUEUE_FILENAME
};