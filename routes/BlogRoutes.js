import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  creataBlogPost,
  getAllBlogPost,
  deleteBlogPost,
  specificBlog,
  updateBlogPost,
} from "../controllers/blogControllers.js";

const BlogRoutes = express.Router();

BlogRoutes.post("/blogs/", upload.any(), creataBlogPost);
// blog post update
BlogRoutes.put("/updatedblogs/:id", upload.any(), updateBlogPost);

// GET all blogs
BlogRoutes.get("/blogs", getAllBlogPost);

// GET a specific blog post by ID
BlogRoutes.get("/blogs/:id", specificBlog);

// delete the blog images
BlogRoutes.delete("/blogs/:id", deleteBlogPost);

export default BlogRoutes;
