import express from "express";
import { getExperienceCenterImages, uploadExperienceCenterImages } from "../../controllers/HomePageControllers/experienceCenterControllers.js";
import { upload } from "../../middleware/UploadFile.js";

const experienceCenterRoutes = express.Router();

// Get images
experienceCenterRoutes.get(
  "/get-experience-center-images",
  getExperienceCenterImages
);

// Upload images (will replace all existing ones)
experienceCenterRoutes.post(
  "/upload-experience-center-images",
  upload.array("images"),
  uploadExperienceCenterImages
);

export default experienceCenterRoutes;
