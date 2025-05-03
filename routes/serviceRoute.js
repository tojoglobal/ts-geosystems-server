import express from "express";
import {
  getServiceContent,
  updateServiceContent,
} from "../controllers/serviceController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/service", getServiceContent);
router.put("/service", verifyAdmin, updateServiceContent);

export default router;
