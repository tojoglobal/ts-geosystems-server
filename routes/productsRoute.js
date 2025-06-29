import express from "express";
import {
  productAdd,
  getProducts,
  deleteProducts,
  getproductById,
  deleteImage,
  updateProductById,
  getProductByIdQuery,
  getProductsByCategory,
  getClearanceProducts,
  searchProducts,
  getProductsForShopAll,
  trackProductView,
  getViewedProducts,
  // getRecommendedProducts,
  searchProductsMobile,
  getRecommendedProducts,
  getProductHighlights,
  getProductTable,
  getProductsByBrand,
  getPopularSearches,
  postPopularSearch,
} from "../controllers/ProductsCont.js";
import { upload } from "../middleware/UploadFile.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const ProductsRoute = express.Router();

ProductsRoute.post(
  "/api/products",
  upload.array("images", 20),
  verifyAdmin,
  productAdd
);
ProductsRoute.get("/api/products-table", getProductTable);
ProductsRoute.get("/api/products", getProducts);
ProductsRoute.put(
  "/api/products/:id",
  upload.array("images", 20),
  updateProductById
);
ProductsRoute.delete("/api/products/:id", verifyAdmin, deleteProducts);
ProductsRoute.post("/api/products/delete-image", deleteImage);
ProductsRoute.get("/api/products/:id", getproductById);
// category/:subcategory wise data// Add this with your other routes
ProductsRoute.get("/api/category-products/:category", getProductsByCategory);
ProductsRoute.get(
  "/api/category-products/:category/:subcategory",
  getProductsByCategory
);

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

ProductsRoute.get("/api/productsids/", getProductByIdQuery);
ProductsRoute.get("/api/clearance", getClearanceProducts);

// Add these new routes
ProductsRoute.get("/api/search", searchProducts);
ProductsRoute.post("/api/popular-searches", postPopularSearch);
ProductsRoute.get("/api/popular-searches", getPopularSearches);
ProductsRoute.get("/api/mobile-search", searchProductsMobile);
ProductsRoute.get("/api/shop-all/product", getProductsForShopAll);
// recent view
ProductsRoute.post("/api/views/product", trackProductView);
ProductsRoute.get("/api/viewed/products/:email", getViewedProducts);
// recommended-products
ProductsRoute.get("/api/recommended-products", getRecommendedProducts);
ProductsRoute.get("/api/product-highlights", getProductHighlights);
// extra
ProductsRoute.get("/api/brand-products/:brand", getProductsByBrand);
 
export default ProductsRoute;
