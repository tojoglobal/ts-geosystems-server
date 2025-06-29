import express from "express";
import {
  createQuotation,
  deleteQuotation,
  getQuotations,
} from "../controllers/quotationController.js";
const quotationRoutes = express.Router();
import { verifyAdmin } from "../middleware/verifyAdmin.js";

quotationRoutes.post("/", createQuotation);
quotationRoutes.get("/", verifyAdmin, getQuotations);
quotationRoutes.delete("/:id", verifyAdmin, deleteQuotation);

export default quotationRoutes;
