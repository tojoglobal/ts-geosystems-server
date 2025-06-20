// const { upload } = require("../middleware/UploadFile");
import express from "express";
import { upload } from "./../middleware/UploadFile.js";
import {
  addCategory,
  addSubCategory,
  getCategory,
  getCateWithSubcateWithData,
  getSubcategory,
  updateCategory,
  updateSubCategory,
} from "../controllers/categoryController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const categoryRoute = express.Router();
categoryRoute.post(
  "/category",
  upload.single("photo"),
  verifyAdmin,
  addCategory
);
categoryRoute.post(
  "/subcategory",
  upload.single("photo"),
  verifyAdmin,
  addSubCategory
);
categoryRoute.put(
  "/category/:id",
  upload.single("photo"),
  verifyAdmin,
  updateCategory
);
categoryRoute.put(
  "/subcategory/:id",
  upload.single("photo"),
  verifyAdmin,
  updateSubCategory
);
categoryRoute.get("/category", getCategory);
categoryRoute.get("/subcategory", getSubcategory);
categoryRoute.get(
  "/category-with-subcategories/:id",
  getCateWithSubcateWithData
);

export default categoryRoute;
