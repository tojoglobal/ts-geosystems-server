import express from "express";
import {
  getAllTags,
  createTag,
  deleteTag,
  updateTag,
} from "../controllers/blogTagController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const blogTagRoute = express.Router();

blogTagRoute.get("/tags", getAllTags);
blogTagRoute.post("/tags", verifyAdmin, createTag);
blogTagRoute.put("/tags/:id", verifyAdmin, updateTag);
blogTagRoute.delete("/tags/:id", verifyAdmin, deleteTag);

export default blogTagRoute;
