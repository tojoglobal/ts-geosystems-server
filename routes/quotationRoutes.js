import express from "express";
import {
  createQuotation,
  getQuotations,
} from "../controllers/quotationController.js";
const quotationRoutes = express.Router();

quotationRoutes.post("/", createQuotation);
quotationRoutes.get("/", getQuotations);

export default quotationRoutes;
