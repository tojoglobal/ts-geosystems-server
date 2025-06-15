import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  creataBlogPost,
  getAllBlogPost,
  deleteBlogPost,
  specificBlog,
  updateBlogPost,
  getRelatedBlogs,
  searchBlogs,
} from "../controllers/blogControllers.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const BlogRoutes = express.Router();
BlogRoutes.post("/blogs/", upload.any(), verifyAdmin, creataBlogPost);
// blog post update
BlogRoutes.put("/updatedblogs/:id", upload.any(), verifyAdmin, updateBlogPost);
// GET all blogs
BlogRoutes.get("/blogs", getAllBlogPost);
// GET a specific blog post by ID
BlogRoutes.get("/blogs/:id", specificBlog);
BlogRoutes.get("/related", getRelatedBlogs);
// delete the blog images
BlogRoutes.delete("/blogs/:id", verifyAdmin, deleteBlogPost);
BlogRoutes.get("/search-blog", searchBlogs);

export default BlogRoutes;
