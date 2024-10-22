const express = require('express')
const mysql = require('mysql')
const faker = require('faker')

const app = express();

const dbConfig = {
  host: 'db',
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const connection = mysql.createConnection(dbConfig);

connection.query('CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))');
connection.end();

app.get('/', (_req, res) => {
  const newName = faker.name.findName();

  const connection = mysql.createConnection(dbConfig);
  connection.query(`INSERT INTO people(name) values("${newName}")`, (err) => {
    if (err) connection.end();
    if (err) throw err;

    connection.query('SELECT name FROM people', (err, rows) => {
      connection.end()
      if (err) throw err;

      const names = rows.map(row => `<li>${row.name}</li>`).join('');

      res.send(`<h1>Full Cycle Rocks!</h1><ul>${names}</ul>`);
    });
  });
});

const port = 3000;
app.listen(port, () => console.log('Server listening on port: ' + port))

