import express from "express";
import { getFooter, updateFooter } from "../controllers/footerController.js";
import { upload } from "../middleware/UploadFile.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const footerRoute = express.Router();

footerRoute.get("/footer", getFooter);

// IMPORTANT: Use upload.fields to handle multiple distinct file input fields
footerRoute.put(
  "/footer",
  upload.fields([
    { name: "iso_image_1", maxCount: 1 },
    { name: "iso_image_2", maxCount: 1 },
    { name: "iso_image_3", maxCount: 1 },
  ]),
  verifyAdmin,
  updateFooter
);

export default footerRoute;
