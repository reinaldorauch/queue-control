const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mysql = require('mysql');
const fs = require('fs');
const db = require(`${__dirname}/libs/db`);

const mysqlPool = mysql.createPool(db.getConnectionInfo());

const rootHandler = require(`${__dirname}/libs/root-handler`);

const PORT = process.env.PORT || 8081;

app.set('view engine', 'ejs');

app.use((req, res, next) => {
  req.db = mysqlPool;
  next();
});
app.use(express.static(`${__dirname}/public/`));
app.use(express.static(`${__dirname}/node_modules/`));

app.use(rootHandler);

app.use((error, req, res, next) => {
  if (error) {
    console.error(error.stack);
    res.status(500).json(error.stack);
  }
});

const QUEUE_FILENAME = `${__dirname}/queue.json`;
const queue = {
  counter: 0,
  mesa: '',
  timestamp: new Date(),

  reset() {
    this.set();
  },

  next(mesa) {
    this.set({ counter: this.counter + 1, mesa });
  },

  set({ counter = 0, mesa = '', timestamp = new Date() }) {
    this.counter = counter;
    this.mesa = mesa;
    this.timestamp = timestamp;
    this.save();
  },

  save() {
    try {
      fs.writeFileSync(QUEUE_FILENAME, JSON.stringify(this));
    } catch (e) {
      console.error(e);
    }
  },

  loadIfExists() {
    if (fs.existsSync(QUEUE_FILENAME)) {
      try {
        this.set(JSON.parse(fs.readFileSync(QUEUE_FILENAME)));
      } catch(e) {
        console.error(e.stack);
      }
    }
  }
};

queue.loadIfExists();

io.set('transports', ['websocket']);

io.on('connection', socket => {
  socket.emit('update-queue', queue);

  socket.on('request-update-queue', mesa => {
    queue.next(mesa);

    io.emit('update-queue', queue);
  });

  socket.on('reset',  () => {
    queue.reset();

    io.emit('update-queue', queue);
  });
});

const serverInstance = server.listen(PORT, () => {
  console.log('Server listening at ', serverInstance.address());
});
