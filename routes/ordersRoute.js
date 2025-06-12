import express from "express";
import {
  deleteOrder,
  getLatestOrders,
  getOrderData,
  getOrdersByEmail,
  postOrder,
  UpdateOrderStatus,
  updatePaymentStaus,
  getUserInboxOrders,
  addUserMessage,
  getAllMessages,
  deleteMessage,
} from "../controllers/ordersController.js";

const ordersRoute = express.Router();

ordersRoute.post("/orderdata", postOrder);
ordersRoute.put("/orders/:order_id/status", UpdateOrderStatus);
ordersRoute.get("/orderinfo", getOrderData);
ordersRoute.get("/latest-order", getLatestOrders);
ordersRoute.delete("/orders/:order_id", deleteOrder);
ordersRoute.put("/orders/:orderId/payment-status", updatePaymentStaus);
ordersRoute.get("/order/:email", getOrdersByEmail);
ordersRoute.get("/order/inbox/:email", getUserInboxOrders);
// user inbox msg to chat admin
ordersRoute.post("/messages", addUserMessage);
ordersRoute.get("/messages", getAllMessages);
ordersRoute.delete("/messages/:id", deleteMessage);

export default ordersRoute;
