import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  createQuickGuides,
  deleteQuickGuides,
  getQuickGuides,
  updateQuickGuides,
} from "../controllers/quickGuidesController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const QuickGuidesRoute = express.Router();

QuickGuidesRoute.get("/quickGuides", getQuickGuides);
QuickGuidesRoute.post(
  "/quickGuides",
  upload.single("photo"),
  verifyAdmin,
  createQuickGuides
);
QuickGuidesRoute.put(
  "/put-quickGuides/:id",
  upload.single("photo"),
  verifyAdmin,
  updateQuickGuides
);
QuickGuidesRoute.delete("/quickGuides/:id", verifyAdmin, deleteQuickGuides);

export default QuickGuidesRoute;
