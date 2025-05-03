import express from "express";
import {
  getPromocodes,
  postPromocodes,
  deltePromocodes,
  putPromocodes,
  applyPromocode,
} from "../controllers/promocodesContrpllers.js";
const promoRoutes = express.Router();

promoRoutes.post("/promocodes", postPromocodes);
promoRoutes.get("/promocodes", getPromocodes);
promoRoutes.put("/promocodes/:id", putPromocodes);
promoRoutes.delete("/promocodes/:id", deltePromocodes);
promoRoutes.post("/promocode", applyPromocode);

export default promoRoutes;
