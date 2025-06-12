import express from "express";
import {
  getVatSetting,
  setVatSetting,
} from "../controllers/settingController.js";
const settingRoute = express.Router();

settingRoute.get("/settings/vat", getVatSetting);
settingRoute.post("/settings/vat", setVatSetting);

export default settingRoute;
