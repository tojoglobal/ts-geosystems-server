import express from "express";
import { getLatestAdminNotifications, markAllNotificationsRead, markNotificationRead } from "../controllers/notificationsController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const notificationsRoute = express.Router();

notificationsRoute.get(
  "/admin/notifications",
  verifyAdmin,
  getLatestAdminNotifications
);
notificationsRoute.put(
  "/admin/notifications/:id/read",
  verifyAdmin,
  markNotificationRead
);
notificationsRoute.put(
  "/admin/notifications/mark-all-read",
  verifyAdmin,
  markAllNotificationsRead
);

export default notificationsRoute;
