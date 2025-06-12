import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getPopularBrandPhoto,
} from "../controllers/brandsController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const brandsRoute = express.Router();

brandsRoute.get("/brands", getBrands);
brandsRoute.get("/brand/popular-photo", getPopularBrandPhoto);
brandsRoute.post("/brands", upload.single("photo"), verifyAdmin, createBrand);
brandsRoute.put(
  "/brands/:id",
  upload.single("photo"),
  verifyAdmin,
  updateBrand
);
brandsRoute.delete("/brands/:id", verifyAdmin, deleteBrand);

export default brandsRoute;
