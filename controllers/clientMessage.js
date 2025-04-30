import db from "../Utils/db.js";

export const addMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    const [result] = await db.execute(
      "INSERT INTO contact_messages (first_name, last_name, email, phone, message) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, phone, message]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all contact messages
export const getClientMessage = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.json({ success: true, messages: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteClientMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM contact_messages WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};