import express from "express";
import {
  getShippingCosts,
  postShippingCost,
  deleteShippingCost,
  putShippingCost,
} from "../controllers/shippingCostsController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const ShippingCostsRoutes = express.Router();

ShippingCostsRoutes.post("/shipping-costs", verifyAdmin, postShippingCost);
ShippingCostsRoutes.get("/shipping-costs", getShippingCosts);
ShippingCostsRoutes.put("/shipping-costs/:id", verifyAdmin, putShippingCost);
ShippingCostsRoutes.delete(
  "/shipping-costs/:id",
  verifyAdmin,
  deleteShippingCost
);

export default ShippingCostsRoutes;
