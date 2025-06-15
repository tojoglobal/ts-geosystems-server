import express from "express";
import {
  addMessage,
  deleteClientMessage,
  getClientMessage,
} from "../controllers/ClientMessage";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const messageRoute = express.Router();

messageRoute.post("/api/contact", addMessage);
messageRoute.get("/api/contact", getClientMessage);
messageRoute.delete("/api/contact/:id", verifyAdmin, deleteClientMessage);

export default messageRoute;
