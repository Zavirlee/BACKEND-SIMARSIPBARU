const databaseConfig = require('./config');

const query = (queryText, param) => {
  return new Promise((resolve, reject) => {
    databaseConfig.promise().query(queryText, param)
    .then(([rows, fields]) => {
      resolve(rows);
    })
    .catch((err) => {
      reject(err);
    })
  })
}

module.exports = query;
