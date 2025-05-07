import express from "express";
import { upload } from "../../middleware/UploadFile.js";
import {
  deleteImage,
  updateImageOrder,
  uploadImages,
  getUploadImages,
} from "../../controllers/HomePageControllers/promo_product_banner_02Controllers.js";
const promo_product_banner_02 = express.Router();

// get Upload images
promo_product_banner_02.get("/getupload-images", getUploadImages);
// Upload images
promo_product_banner_02.post(
  "/upload-images",
  upload.array("images"),
  uploadImages
);

// Delete image
promo_product_banner_02.delete("/delete-image/:id", deleteImage);

// Update order
promo_product_banner_02.post("/update-image-order", updateImageOrder);

export default promo_product_banner_02;
