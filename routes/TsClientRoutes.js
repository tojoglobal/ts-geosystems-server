import express from "express";
import {
  getClients,
  postClient,
  putClient,
  deleteClient,
} from "../controllers/TsClientControllers.js";

const TsClientRoutes = express.Router();

TsClientRoutes.get("/clients/search", getClients);
TsClientRoutes.post("/clients", postClient);
TsClientRoutes.put("/clients/:id", putClient);
TsClientRoutes.delete("/clients/:id", deleteClient);

export default TsClientRoutes;
