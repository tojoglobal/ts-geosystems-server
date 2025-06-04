import express from "express";
import {
  getEquipments,
  postEquipment,
  deleteEquipment,
  putEquipment,
} from "../controllers/TSCCEquipmentControllers.js";
const TSCCEquipmentRoutes = express.Router();

TSCCEquipmentRoutes.post("/equipments", postEquipment);
TSCCEquipmentRoutes.get("/equipments/search", getEquipments);
TSCCEquipmentRoutes.put("/equipments/:id", putEquipment);
TSCCEquipmentRoutes.delete("/equipments/:id", deleteEquipment);

export default TSCCEquipmentRoutes;
