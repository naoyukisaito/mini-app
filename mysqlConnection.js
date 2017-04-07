var mysql = require('mysql');

var dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'shop',
  port: '8889'
};

var connection = mysql.createConnection(dbConfig);

module.exports = connection;
