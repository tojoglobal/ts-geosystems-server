import express from "express";
import {
  deleteOrder,
  getLatestOrders,
  getOrderData,
  getOrdersByEmail,
  postOrder,
  UpdateOrderStatus,
  updatePaymentStaus,
} from "../controllers/ordersController.js";

const ordersRoute = express.Router();

ordersRoute.post("/orderdata", postOrder);
ordersRoute.put("/orders/:order_id/status", UpdateOrderStatus);
ordersRoute.get("/orderinfo", getOrderData);
ordersRoute.get("/latest-order", getLatestOrders);
ordersRoute.delete("/orders/:order_id", deleteOrder);
ordersRoute.put("/orders/:orderId/payment-status", updatePaymentStaus);
ordersRoute.get("/order/:email", getOrdersByEmail);

export default ordersRoute;
