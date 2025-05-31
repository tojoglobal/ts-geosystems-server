import express from "express";
import { upload } from "../../middleware/UploadFile.js";
import {
  getLastBannerImages,
  uploadLastBannerImages,
  deleteLastBannerImage,
} from "../../controllers/HomePageControllers/lastBannerControllers.js";
const lastBannerRoutes = express.Router();

lastBannerRoutes.get("/get-last-banner-images", getLastBannerImages);

lastBannerRoutes.post(
  "/upload-last-banner-images",
  upload.array("images"),
  uploadLastBannerImages
);

lastBannerRoutes.delete("/delete-last-banner-image/:id", deleteLastBannerImage);

export default lastBannerRoutes;
