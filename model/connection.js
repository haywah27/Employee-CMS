const mysql = require('mysql');

const poop = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: 'yourRootPassword',
    database: 'company_hw',
  });

module.exports = poop;

