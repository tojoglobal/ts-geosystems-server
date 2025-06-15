import express from "express";
import {
  getClients,
  postClient,
  putClient,
  deleteClient,
} from "../controllers/TsClientControllers.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const TsClientRoutes = express.Router();

TsClientRoutes.get("/clients/search", verifyAdmin, getClients);
TsClientRoutes.post("/clients", verifyAdmin, postClient);
TsClientRoutes.put("/clients/:id", verifyAdmin, putClient);
TsClientRoutes.delete("/clients/:id", verifyAdmin, deleteClient);

export default TsClientRoutes;
