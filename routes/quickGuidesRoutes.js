import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  createQuickGuides,
  deleteQuickGuides,
  getQuickGuides,
  updateQuickGuides,
} from "../controllers/quickGuidesController.js";

const QuickGuidesRoute = express.Router();

QuickGuidesRoute.get("/quickGuides", getQuickGuides);
QuickGuidesRoute.post(
  "/quickGuides",
  upload.single("photo"),
  createQuickGuides
);
QuickGuidesRoute.put(
  "/put-quickGuides/:id",
  upload.single("photo"),
  updateQuickGuides
);
QuickGuidesRoute.delete("/quickGuides/:id", deleteQuickGuides);

export default QuickGuidesRoute;
