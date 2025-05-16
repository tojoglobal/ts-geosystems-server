import express from "express";

import { upload } from "./../middleware/UploadFile.js";
import {
  getSupportRequests,
  saveSupportRequest,
} from "../controllers/supportController.js";
const supportRoutes = express.Router();

// POST API to save support form data
supportRoutes.post("/support", upload.array("files"), saveSupportRequest);

// GET API to retrieve all support requests
supportRoutes.get("/support", getSupportRequests);

export default supportRoutes;
