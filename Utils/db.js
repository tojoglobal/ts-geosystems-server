import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Create a connection pool
// local pool
// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "tojonews",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
// remote pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
