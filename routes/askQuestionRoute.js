import express from "express";
import {
  submitProductQuestion,
  getProductQuestions,
  deleteProductQuestion,
} from "../controllers/askQuestionCont.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const askQuestionRoute = express.Router();
askQuestionRoute.post("/product-questions", submitProductQuestion);
askQuestionRoute.get("/product-questions", getProductQuestions);
askQuestionRoute.delete("/product-questions/:id", verifyAdmin, deleteProductQuestion);

export default askQuestionRoute;
