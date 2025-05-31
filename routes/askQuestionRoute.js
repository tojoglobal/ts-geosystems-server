import express from "express";
import {
  submitProductQuestion,
  getProductQuestions,
  deleteProductQuestion,
} from "../controllers/askQuestionCont.js";

const askQuestionRoute = express.Router();
askQuestionRoute.post("/product-questions", submitProductQuestion);
askQuestionRoute.get("/product-questions", getProductQuestions);
askQuestionRoute.delete("/product-questions/:id", deleteProductQuestion);

export default askQuestionRoute;
