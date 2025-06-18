import express from "express";
import { getFooter, updateFooter } from "../controllers/footerController.js";
import { upload } from "../middleware/UploadFile.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const footerRoute = express.Router();

footerRoute.get("/footer", getFooter);

// Add payment_method_image field for upload.fields
footerRoute.put(
  "/footer",
  upload.fields([
    { name: "iso_image_1", maxCount: 1 },
    { name: "iso_image_2", maxCount: 1 },
    { name: "iso_image_3", maxCount: 1 },
    { name: "payment_method_image", maxCount: 1 },
  ]),
  verifyAdmin,
  updateFooter
);

export default footerRoute;
