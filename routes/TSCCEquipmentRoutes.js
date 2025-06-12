import express from "express";
import {
  getEquipments,
  postEquipment,
  deleteEquipment,
  putEquipment,
} from "../controllers/TSCCEquipmentControllers.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
const TSCCEquipmentRoutes = express.Router();

TSCCEquipmentRoutes.post("/equipments", verifyAdmin, postEquipment);
TSCCEquipmentRoutes.get("/equipments/search", getEquipments);
TSCCEquipmentRoutes.put("/equipments/:id", verifyAdmin, putEquipment);
TSCCEquipmentRoutes.delete("/equipments/:id", verifyAdmin, deleteEquipment);

export default TSCCEquipmentRoutes;
