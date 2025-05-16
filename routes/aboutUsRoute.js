import express from "express";
import {
  getAboutUs,
  getAboutUsImages,
  updateAboutUs,
  updateAboutUsImages,
} from "../controllers/aboutUsController.js";
import { upload } from "../middleware/UploadFile.js";

// const upload = multer({
//   dest: "uploads/about-us/",
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

const aboutUsRoute = express.Router();

aboutUsRoute.get("/about-us", getAboutUs);
aboutUsRoute.put(
  "/about-us",
  upload.fields([
    { name: "who_we_serve_image", maxCount: 1 },
    { name: "bottom_section_image", maxCount: 1 },
  ]),
  updateAboutUs
);

aboutUsRoute.put("/update-about-us-images", upload.any(), updateAboutUsImages);
aboutUsRoute.get("/get-about-us-images", getAboutUsImages);

export default aboutUsRoute;
