import express from "express";
import { addMessage, deleteClientMessage, getClientMessage } from "../controllers/ClientMessage";

const messageRoute = express.Router();

messageRoute.post("/api/contact", addMessage);
messageRoute.get("/api/contact", getClientMessage);
messageRoute.delete("/api/contact/:id", deleteClientMessage);

export default messageRoute;
