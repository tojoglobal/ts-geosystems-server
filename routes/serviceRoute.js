import express from "express";
import {
  getServiceContent,
  updateServiceContent,
} from "../controllers/serviceController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const serviceRoute = express.Router();

serviceRoute.get("/service", getServiceContent);
serviceRoute.put("/service", verifyAdmin, updateServiceContent);

export default serviceRoute;
