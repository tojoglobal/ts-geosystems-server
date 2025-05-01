import express from "express";
import {
  getOrderData,
  postOrder,
  UpdateOrderStatus,
} from "../controllers/ordersController.js";

const ordersRoute = express.Router();

ordersRoute.post("/", postOrder);
ordersRoute.put("/:order_id/status", UpdateOrderStatus);
ordersRoute.get("/", getOrderData);

export default ordersRoute;
