import express from "express";
import {
  getAllBlogTypes,
  createNewBlogType,
  updateBlogType,
  deleteBlogType,
} from "../controllers/blogTypeControllers.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const blogTypeRoutes = express.Router();

// GET all blog types
blogTypeRoutes.get("/blog-types", getAllBlogTypes);
blogTypeRoutes.post("/blog-types", verifyAdmin, createNewBlogType);
blogTypeRoutes.put("/blog-types/:id", verifyAdmin, updateBlogType);
// DELETE a blog type
blogTypeRoutes.delete("/blog-types/:id", verifyAdmin, deleteBlogType);

export default blogTypeRoutes;
