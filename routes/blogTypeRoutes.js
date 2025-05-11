import express from "express";
import {
  getAllBlogTypes,
  createNewBlogType,
  updateBlogType,
  deleteBlogType,
} from "../controllers/blogTypeControllers.js";

const blogTypeRoutes = express.Router();

// GET all blog types
blogTypeRoutes.get("/blog-types", getAllBlogTypes);

// CREATE a new blog type
blogTypeRoutes.post("/blog-types", createNewBlogType);

// UPDATE a blog type
blogTypeRoutes.put("/blog-types/:id", updateBlogType);

// DELETE a blog type
blogTypeRoutes.delete("/blog-types/:id", deleteBlogType);

export default blogTypeRoutes;
