import express from "express";
import { getHelpdeskInfo, updateHelpdeskInfo } from "../controllers/helpdeskController.js";
const helpdeskRoute = express.Router();

helpdeskRoute.get("/helpdesk-info", getHelpdeskInfo);
helpdeskRoute.put("/helpdesk-info", updateHelpdeskInfo);

export default helpdeskRoute;
