import express from "express";

import { upload } from "./../middleware/UploadFile.js";
import {
  getSupportContent,
  getSupportRequests,
  saveSupportRequest,
  updateSupportContent,
} from "../controllers/supportController.js";
const supportRoutes = express.Router();

// POST API to save support form data
supportRoutes.post("/support", upload.array("files"), saveSupportRequest);

// GET API to retrieve all support requests
supportRoutes.get("/support", getSupportRequests);
supportRoutes.get("/support-content", getSupportContent);
supportRoutes.put("/support-content", updateSupportContent);

export default supportRoutes;
