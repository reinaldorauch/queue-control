const db = require(`${__dirname}/db`);

function persist(pool, { counter, mesa, timestamp }) {
  const sql = 'INSERT INTO log_fila (counter, mesa, timestamp) VALUES (?)';
  return db.getConnection(pool)
    .then(c => db.mysqlQuery(c, sql, [[counter, mesa, timestamp]])
        .then(() => c.release()));
}

module.exports = {
  persist
};
