import express from "express";
// import multer from "multer";
import {
  saveTradeInData,
  getTradeInData,
  getTradeInContent,
  updateTradeInContent,
} from "../controllers/tradeInController.js";
import { upload } from "../middleware/UploadFile.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const tradeInRoutes = express.Router();

// Configure multer for file uploads
// const upload = multer({ dest: "/tradeIn/" });

// Save form data and files
tradeInRoutes.post("/trade-in", upload.array("photos"), saveTradeInData);
// Retrieve all form submissions
tradeInRoutes.get("/trade-in", getTradeInData);

tradeInRoutes.get("/trade-in-content", getTradeInContent);
tradeInRoutes.put("/trade-in-content", verifyAdmin, updateTradeInContent);

export default tradeInRoutes;
