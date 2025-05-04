import express from "express";
import {
  getTaxes,
  postTaxes,
  deleteTaxes,
  putTaxes,
} from "../controllers/taxesControllers.js";
const TaxesRoutes = express.Router();

TaxesRoutes.post("/taxes", postTaxes);
TaxesRoutes.get("/taxes", getTaxes);
TaxesRoutes.put("/taxes/:id", putTaxes);
TaxesRoutes.delete("/taxes/:id", deleteTaxes);

export default TaxesRoutes;
