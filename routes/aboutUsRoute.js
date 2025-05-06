import express from "express";
import { getAboutUs, updateAboutUs } from "../controllers/aboutUsController.js";
import multer from "multer";

const upload = multer({
  dest: "uploads/about-us/",
  limits: { fileSize: 10 * 1024 * 1024 },
});

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

export default aboutUsRoute;
