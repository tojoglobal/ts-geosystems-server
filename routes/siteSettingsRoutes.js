import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getSettings,
  updateSettings,
  uploadMainLogo,
  uploadFavicon,
} from "../controllers/siteSettingsController.js";
import { upload } from "../middleware/UploadFile.js";

// For __dirname in ES Modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteSettingsRoutes = express.Router();

// GET: Get all site settings
siteSettingsRoutes.get("/", getSettings);

// PUT: Update settings (text fields only, no file upload here)
siteSettingsRoutes.put("/", updateSettings);

// POST: Upload main logo
siteSettingsRoutes.post(
  "/upload/mainLogo",
  upload.single("mainLogo"),
  uploadMainLogo
);

// POST: Upload favicon
siteSettingsRoutes.post(
  "/upload/favicon",
  upload.single("favicon"),
  uploadFavicon
);

export default siteSettingsRoutes;
