import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Create a connection pool
// local pool
// const dbConfig = {
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "tsgb_db",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// };

// remote pool
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

const db = mysql.createPool(dbConfig);

db.getConnection()
  .then((conn) => {
    console.log("✅ MySQL connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection error:", err);
  });

export default db;
