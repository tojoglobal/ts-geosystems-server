import db from "../Utils/db.js";

export const getLatestAdminNotifications = async (req, res) => {
  try {
    // Get latest 10 notifications, unread first, newest first
    const [rows] = await db.query(
      "SELECT * FROM notifications ORDER BY is_read ASC, created_at DESC LIMIT 10"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await db.query("UPDATE notifications SET is_read = 1 WHERE is_read = 0");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
};
