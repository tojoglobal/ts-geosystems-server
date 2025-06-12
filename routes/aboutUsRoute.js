import express from "express";
import {
  getAboutUs,
  getAboutUsImages,
  updateAboutUs,
  updateAboutUsImages,
} from "../controllers/aboutUsController.js";
import { upload } from "../middleware/UploadFile.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const aboutUsRoute = express.Router();

aboutUsRoute.get("/about-us", getAboutUs);
aboutUsRoute.put(
  "/about-us",
  upload.fields([
    { name: "who_we_serve_image", maxCount: 1 },
    { name: "bottom_section_image", maxCount: 1 },
  ]),
  verifyAdmin,
  updateAboutUs
);

aboutUsRoute.put(
  "/update-about-us-images",
  upload.any(),
  verifyAdmin,
  updateAboutUsImages
);
aboutUsRoute.get("/get-about-us-images", getAboutUsImages);

export default aboutUsRoute;
