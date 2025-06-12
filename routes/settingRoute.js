import express from "express";
import {
  getVatSetting,
  setVatSetting,
} from "../controllers/settingController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
const settingRoute = express.Router();

settingRoute.get("/settings/vat", getVatSetting);
settingRoute.post("/settings/vat", verifyAdmin, setVatSetting);

export default settingRoute;
