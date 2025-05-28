import express from "express";
import {
  getUsedEquipmentContent,
  updateUsedEquipmentContent,
} from "../controllers/usedController.js";
import { upload } from "../middleware/UploadFile.js";

const usedRoute = express.Router();

usedRoute.get("/used-equipment-content", getUsedEquipmentContent);
usedRoute.put(
  "/used-equipment-content",
  upload.single("banner_image"),
  updateUsedEquipmentContent
);

export default usedRoute;
