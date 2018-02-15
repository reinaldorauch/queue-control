const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mysql = require('mysql');
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

const queue = {
  counter: 0,
  mesa: '',
  reset() {
    this.counter = 0;
    this.mesa = '';
  }
};

io.set('transports', ['websocket']);

io.on('connection', socket => {
  socket.emit('update-queue', queue);

  socket.on('request-update-queue', mesa => {
    queue.counter++;
    queue.mesa = mesa;

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