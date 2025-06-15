import express from "express";
import {
  getTaxes,
  postTaxes,
  deleteTaxes,
  putTaxes,
} from "../controllers/taxesControllers.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
const TaxesRoutes = express.Router();

TaxesRoutes.post("/taxes", verifyAdmin, postTaxes);
TaxesRoutes.get("/taxes", getTaxes);
TaxesRoutes.put("/taxes/:id", verifyAdmin, putTaxes);
TaxesRoutes.delete("/taxes/:id", verifyAdmin, deleteTaxes);

export default TaxesRoutes;
