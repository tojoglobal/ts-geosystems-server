// const { upload } = require("../middleware/UploadFile");
import express from "express";
import { upload } from "./../middleware/UploadFile.js";
import {
  addCategory,
  addSubCategory,
  getCategory,
  getSubcategory,
  updateCategory,
  updateSubCategory,
} from "../controllers/categoryController.js";

const categoryRoute = express.Router();
categoryRoute.post("/category", upload.single("photo"), addCategory);
categoryRoute.post("/subcategory", upload.single("photo"), addSubCategory);
categoryRoute.put("/category/:id", upload.single("photo"), updateCategory);
categoryRoute.put(
  "/subcategory/:id",
  upload.single("photo"),
  updateSubCategory
);
categoryRoute.get("/category", getCategory);
categoryRoute.get("/subcategory", getSubcategory);

export default categoryRoute;
