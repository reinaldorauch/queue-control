const db = require(`${__dirname}/db`);

function persist(pool, { counter, mesa, timestamp }) {
  const sql = 'INSERT INTO log_fila (counter, mesa, timestamp) VALUES (?)';
  return db.getConnection(pool)
    .then(c => db.mysqlQuery(c, sql, [[counter, mesa, timestamp]])
        .then(() => c.release()));
}

function getLastFiveCalls(pool) {
  const sql = 'SELECT counter, mesa, timestamp FROM log_fila ORDER BY id DESC LIMIT 5';
  return db.getConnection(pool)
    .then(c => db.mysqlQuery(c, sql)
      .then(([r]) => {
        c.release();
        return r;
      }));
}

module.exports = {
  persist,
  getLastFiveCalls,
};
