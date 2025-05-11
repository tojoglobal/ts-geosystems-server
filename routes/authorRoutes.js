import express from "express";
import {
  createNewAuthor,
  deteteAuthor,
  getAllAuthor,
  updateAuthor,
} from "../controllers/authorControllers.js";

const authorRoutes = express.Router();

// GET all authors
authorRoutes.get("/authors", getAllAuthor);

// CREATE a new author
authorRoutes.post("/authors", createNewAuthor);

// UPDATE an author
authorRoutes.put("/authors/:id", updateAuthor);

// DELETE an author
authorRoutes.delete("/authors/:id", deteteAuthor);

export default authorRoutes;
