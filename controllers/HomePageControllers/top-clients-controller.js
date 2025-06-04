import db from "../../Utils/db.js";
import fs from "fs";
import path from "path";

// Get all top clients
export const get_top_clients = async (req, res) => {
  try {
    const [result] = await db.execute(
      "SELECT * FROM top_clients ORDER BY id DESC"
    );
    res
      .status(200)
      .json({ message: "Clients fetched", total: result.length, data: result });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Add new client(s) (images only)
export const add_top_clients = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (!files.length)
      return res.status(400).json({ error: "No files uploaded" });

    const values = files.map((file) => [`/uploads/${file.filename}`]);
    await db.query("INSERT INTO top_clients (imageUrl) VALUES ?", [values]);
    res.json({ success: true, message: "Clients added" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Delete a client
export const delete_top_client = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT imageUrl FROM top_clients WHERE id = ?",
      [id]
    );
    const photo = rows[0]?.imageUrl;
    if (photo) {
      const fileName = photo.replace(/^\/?uploads\//, "");
      const filePath = path.join("uploads", fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.query("DELETE FROM top_clients WHERE id = ?", [id]);
    res.json({ success: true, message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ error: "Database or filesystem error" });
  }
};
