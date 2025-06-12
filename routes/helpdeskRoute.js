import express from "express";
import {
  getHelpdeskInfo,
  updateHelpdeskInfo,
} from "../controllers/helpdeskController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
const helpdeskRoute = express.Router();

helpdeskRoute.get("/helpdesk-info", getHelpdeskInfo);
helpdeskRoute.put("/helpdesk-info", verifyAdmin, updateHelpdeskInfo);

export default helpdeskRoute;
