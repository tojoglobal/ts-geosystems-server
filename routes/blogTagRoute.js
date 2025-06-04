import express from "express";
import {
  getAllTags,
  createTag,
  deleteTag,
  updateTag,
} from "../controllers/blogTagController.js";

const blogTagRoute = express.Router();

blogTagRoute.get("/tags", getAllTags);
blogTagRoute.post("/tags", createTag);
blogTagRoute.put("/tags/:id", updateTag);
blogTagRoute.delete("/tags/:id", deleteTag);

export default blogTagRoute;
