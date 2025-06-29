import express from "express";

import { upload } from "./../middleware/UploadFile.js";
import {
  deleteSupportRequest,
  getSupportContent,
  getSupportRequests,
  saveSupportRequest,
  updateSupportContent,
} from "../controllers/supportController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
const supportRoutes = express.Router();

// POST API to save support form data
supportRoutes.post("/support", upload.array("files"), saveSupportRequest);

// GET API to retrieve all support requests
supportRoutes.get("/support", getSupportRequests);
supportRoutes.get("/support-content", getSupportContent);
supportRoutes.delete("/support/:id", verifyAdmin, deleteSupportRequest); 
supportRoutes.put("/support-content", verifyAdmin, updateSupportContent);

export default supportRoutes;
