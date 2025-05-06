import express from "express";
import {
  getOrderData,
  postOrder,
  UpdateOrderStatus,
} from "../controllers/ordersController.js";

const ordersRoute = express.Router();

ordersRoute.post("/orderdata", postOrder);
ordersRoute.put("/orders/:order_id/status", UpdateOrderStatus);
ordersRoute.get("/orderinfo", getOrderData);

export default ordersRoute;
