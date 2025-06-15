import db from "../Utils/db.js";

export const getLatestAdminNotifications = async (req, res) => {
  try {
    // Accept page & limit as query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await db.query(
      `SELECT * FROM notifications 
       ORDER BY is_read ASC, created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Get total count for frontend pagination if needed
    const [countRes] = await db.query(
      "SELECT COUNT(*) as total FROM notifications"
    );

    res.json({
      notifications: rows,
      total: countRes[0]?.total || 0,
      page,
      limit,
      hasMore: offset + rows.length < (countRes[0]?.total || 0),
    });
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
