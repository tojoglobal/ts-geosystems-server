import express from "express";
import { getLatestAdminNotifications, markAllNotificationsRead, markNotificationRead } from "../controllers/notificationsController.js";

const notificationsRoute = express.Router();

notificationsRoute.get("/admin/notifications", getLatestAdminNotifications);
notificationsRoute.put("/admin/notifications/:id/read", markNotificationRead);
notificationsRoute.put(
  "/admin/notifications/mark-all-read",
  markAllNotificationsRead
);

export default notificationsRoute;
