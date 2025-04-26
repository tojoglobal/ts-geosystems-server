import express from "express";
import {
  productAdd,
  getProducts,
  deleteProducts,
  getproductById,
  deleteImage,
  updateProductById,
} from "../controllers/ProductsCont.js";
import { upload } from "../middleware/UploadFile.js";

const ProductsRoute = express.Router();

ProductsRoute.post("/api/products", upload.array("images", 20), productAdd);
ProductsRoute.get("/api/products", getProducts);
ProductsRoute.put(
  "/api/products/:id",
  upload.array("images", 20),
  updateProductById
);
ProductsRoute.delete("/api/products/:id", deleteProducts);
ProductsRoute.post("/api/products/delete-image", deleteImage);
ProductsRoute.get("/api/products/:id", getproductById);
ProductsRoute.get("/api/products/:id/reviews", (req, res) => {
  res
    .status(200)
    .json({ message: `Get reviews for product with ID: ${req.params.id}` });
});
ProductsRoute.post("/api/products/:id/reviews", (req, res) => {
  res
    .status(200)
    .json({ message: `Add review for product with ID: ${req.params.id}` });
});
ProductsRoute.put("/api/products/:id/reviews/:reviewId", (req, res) => {
  res.status(200).json({
    message: `Update review with ID: ${req.params.reviewId} for product with ID: ${req.params.id}`,
  });
});

export default ProductsRoute;
