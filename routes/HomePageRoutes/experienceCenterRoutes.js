import express from "express";
import { upload } from "../../middleware/UploadFile.js";
import {
  getExperienceCenterImages,
  uploadExperienceCenterImages,
  deleteExperienceCenterImage,
} from "../../controllers/HomePageControllers/experienceCenterControllers.js";

const experienceCenterRoutes = express.Router();

// Get images
experienceCenterRoutes.get(
  "/get-experience-center-images",
  getExperienceCenterImages
);

// Upload images (will add up to available slots)
experienceCenterRoutes.post(
  "/upload-experience-center-images",
  upload.array("images"),
  uploadExperienceCenterImages
);

// Delete image
experienceCenterRoutes.delete(
  "/delete-experience-center-image/:id",
  deleteExperienceCenterImage
);

export default experienceCenterRoutes;
