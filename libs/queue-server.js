const queueDao = require(`${__dirname}/queue-dao`);
const { Queue } = require(`${__dirname}/queue`);

module.exports = (io, mysqlPool) => {
  const queue = new Queue();

  queue.on('update', () => {
    queueDao.persist(mysqlPool, queue)
      .catch(e => console.error('Error on persisting queue to database:', e.stack));
  });

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
};
