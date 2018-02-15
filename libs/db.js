const q = require('q');
const logQueries = Number(process.env.LOG_QUERIES) === 1;
const logTransactionError = Number(process.env.LOG_TRANSACTION_ERROR) === 1;

function getConnectionInfo() {
  const {
    MYSQL_SOCKET_PATH,
    INSTANCE_CONNECTION_NAME,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE
  } = process.env;

  const connObject = {
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
  };

  if (INSTANCE_CONNECTION_NAME) {
    connObject.socketPath = `${MYSQL_SOCKET_PATH}/${INSTANCE_CONNECTION_NAME}`;
  }

  if (!INSTANCE_CONNECTION_NAME && MYSQL_SOCKET_PATH) {
    connObject.socketPath = MYSQL_SOCKET_PATH;
  }

  const connString = process.env.MYSQL_CONN_STRING || 'mysql://root:@localhost/queue_control';
  return INSTANCE_CONNECTION_NAME || MYSQL_SOCKET_PATH ? connObject : connString;
}

function getConnection(pool) {
  return q.ninvoke(pool, 'getConnection');
}

function mysqlQuery(conn, query, data) {
  if (logQueries) {
    console.log('Query:', query);
    console.log('Params:', data);
  }
  return q.ninvoke(conn, 'query', query, data);
}

function setSerializableIsolation(conn) {
  return mysqlQuery(conn, 'SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ')
    .then(() => conn);
}

function startTransaction(conn) {
  return mysqlQuery(conn, 'START TRANSACTION')
    .then(() => conn);
}

function releaseOrEndConn(conn) {
  return () => {
    if (conn.release) {
      conn.release();
    } else {
      return q.ninvoke(conn, 'end');
    }
  };
}

function commitTransaction(conn, res) {
  return mysqlQuery(conn, 'COMMIT')
    .then(releaseOrEndConn(conn))
    .then(() => res);
}

function rollbackTransaction(conn) {
  return mysqlQuery(conn, 'ROLLBACK')
    .then(releaseOrEndConn(conn));
}

function handleErrorInTransaction(conn) {
  return (err) => {
    if (logTransactionError) {
      console.error('Error in transaction:', err.stack || err.message || err);
    }
    return rollbackTransaction(conn)
      .then(() => {
        switch (err.code) {
          case 'ER_DUP_ENTRY':
            const dupEntry = err.message.replace(/^.+'([\w.]+)'.+$/, '$1');
            const newErr = { code: 'ARQUIVO_EXISTENTE', message: `O arquivo ${dupEntry} já existe no sistema` };
            throw newErr;
          default:
            throw err;
        }
      });
  };
}

function inDeadlockRedoMainFunction(mainFunction, args) {
  return (err) => {
    switch (err.code) {
      case 'ER_LOCK_DEADLOCK':
      case 'ER_LOCK_WAIT_TIMEOUT':
        return mainFunction(...args);
      default:
        throw err;
    }
  };
}

module.exports = {
  mysqlQuery,
  getConnection,
  startTransaction,
  getConnectionInfo,
  commitTransaction,
  rollbackTransaction,
  handleErrorInTransaction,
  setSerializableIsolation,
  inDeadlockRedoMainFunction
};
