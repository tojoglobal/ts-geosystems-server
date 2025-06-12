import express from "express";
import {
  get_homepage_single_images,
  Put_homepage_single_images,
} from "../../controllers/HomePageControllers/homepage-single-images-contorllers.js";
import { upload } from "../../middleware/UploadFile.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";

const homepage_single_images = express.Router();

homepage_single_images.put(
  "/homepage-single-images/:id",
  upload.single("image"),
  verifyAdmin,
  Put_homepage_single_images
);
homepage_single_images.get(
  "/get-homepage-single-images",
  get_homepage_single_images
);

export default homepage_single_images;
