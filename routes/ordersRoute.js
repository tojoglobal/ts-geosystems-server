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
  getOrderMetrics,
  getOrdersStatusSummary,
  getOrdersPaymentMethodSummary,
} from "../controllers/ordersController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const ordersRoute = express.Router();

ordersRoute.post("/orderdata", authenticateUser, postOrder);
ordersRoute.put("/orders/:order_id/status", verifyAdmin, UpdateOrderStatus);
ordersRoute.get("/orderinfo", getOrderData);
ordersRoute.get("/latest-order", getLatestOrders);
ordersRoute.delete("/orders/:order_id", verifyAdmin, deleteOrder);
ordersRoute.put(
  "/orders/:orderId/payment-status",
  verifyAdmin,
  updatePaymentStaus
);
ordersRoute.get("/order/:email", authenticateUser, getOrdersByEmail);
ordersRoute.get("/order/inbox/:email", authenticateUser, getUserInboxOrders);
// user inbox msg to chat admin
ordersRoute.post("/messages", authenticateUser, addUserMessage);
ordersRoute.get("/messages", verifyAdmin, getAllMessages);
ordersRoute.delete("/messages/:id", verifyAdmin, deleteMessage);
ordersRoute.get("/order-metrics", verifyAdmin, getOrderMetrics);
ordersRoute.get("/orders-status-summary", verifyAdmin, getOrdersStatusSummary);
ordersRoute.get(
  "/orders-payment-method-summary",
  verifyAdmin,
  getOrdersPaymentMethodSummary
);

export default ordersRoute;
