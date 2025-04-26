import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandsController.js";

const brandsRoute = express.Router();

brandsRoute.get("/brands", getBrands);
brandsRoute.post("/brands", upload.single("photo"), createBrand);
brandsRoute.put("/brands/:id", upload.single("photo"), updateBrand);
brandsRoute.delete("/brands/:id", deleteBrand);

export default brandsRoute;
