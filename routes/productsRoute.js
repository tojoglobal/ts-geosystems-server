import express from "express";
import { productAdd } from "../controllers/ProductsCont.js";
import { upload } from "../middleware/UploadFile.js";

const ProductsRoute = express.Router();

ProductsRoute.post("/api/products", upload.array("images", 20), productAdd);

export default ProductsRoute;
