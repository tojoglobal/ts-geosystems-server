import db from "../Utils/db.js";

/**
 * type: "order" | "question" | "message" | "contact"
 * refId: related id from order/question/message/contact table
 * content: string
 * link: string (URL to admin dashboard page)
 */
export async function addAdminNotification({ type, refId, content, link }) {
  await db.query(
    "INSERT INTO notifications (type, ref_id, content, link) VALUES (?, ?, ?, ?)",
    [type, refId, content, link]
  );
}
