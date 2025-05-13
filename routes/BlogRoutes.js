import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  creataBlogPost,
  getAllBlogPost,
  specificBlog,
  updateBlogPost,
} from "../controllers/blogControllers.js";

const BlogRoutes = express.Router();

BlogRoutes.post("/blogs/", upload.any(), creataBlogPost);
// blog post update
BlogRoutes.put("/blogs/:id", upload.any(), updateBlogPost);

// GET all blogs
BlogRoutes.get("/blogs", getAllBlogPost);

// GET a specific blog post by ID
BlogRoutes.get("/blogs/:id", specificBlog);

export default BlogRoutes;
