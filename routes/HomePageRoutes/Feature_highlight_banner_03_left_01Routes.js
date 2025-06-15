import express from "express";
import { upload } from "../../middleware/UploadFile.js";
import {
  featureDeleteImage,
  featureUpdateImageOrder,
  featureUploadImages,
  getUploadImages,
} from "../../controllers/HomePageControllers/Feature_highlight_banner_03_left_01_Controllers.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";
const Feature_highlight_banner_03_left_01 = express.Router();

// get Upload images
Feature_highlight_banner_03_left_01.get(
  "/feature-getupload-images",
  getUploadImages
);
// Upload images
Feature_highlight_banner_03_left_01.post(
  "/feature-upload-images",
  upload.array("featureImages"),
  verifyAdmin,
  featureUploadImages
);

// Delete image
Feature_highlight_banner_03_left_01.delete(
  "/feature-delete-image/:id",
  verifyAdmin,
  featureDeleteImage
);

// Update order
Feature_highlight_banner_03_left_01.post(
  "/feature-update-image-order",
  verifyAdmin,
  featureUpdateImageOrder
);

export default Feature_highlight_banner_03_left_01;
