// connect.js

const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const username = process.env.username;
const password = process.env.password;
const database = process.env.database;
const host = process.env.host;

const connection = mysql.createConnection({
  user: "permac2000",
  host: host,
  password: password,
  database: database,
});

function connectToDatabase() {
  console.log(username);
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to database:", err);
      throw err; // You might want to handle this more gracefully
    }
    console.log("Connected to MySQL database");
  });
}

module.exports = { connection, connectToDatabase };
