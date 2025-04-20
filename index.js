import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import adminRoute from "./routes/adminRoute.js";
import { EventEmitter } from "events";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
EventEmitter.defaultMaxListeners = 20;

// if handle your project file system use this
app.use(express.static("public"));

const localhostPort1 = 5173;
const localhostPort2 = 5174;
const localhostPort3 = 3000;
const allowedOrigins = [
  `http://localhost:${localhostPort1}`,
  `http://localhost:${localhostPort2}`,
  `http://localhost:${localhostPort3}`,
  // here all acces domain name
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Router set up
app.use(adminRoute);

app.get("/", (req, res) => {
  return res.send(" <h1>Welcome to the TSGB Server Server</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running where http://localhost:${PORT}`);
});
