import db from "../Utils/db.js";

export const postPromocodes = async (req, res) => {
  const { title, code_name, no_of_times, discount, status, type } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO promo_codes (title, code_name, no_of_times, discount, status, type, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, code_name, no_of_times, discount, status, type]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPromocodes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM promo_codes ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const putPromocodes = async (req, res) => {
  const { id } = req.params;
  const { title, code_name, no_of_times, discount, status, type } = req.body;
  try {
    await db.query(
      `UPDATE promo_codes SET title=?, code_name=?, no_of_times=?, discount=?, status=?, type=?, updated_at=NOW() WHERE id=?`,
      [title, code_name, no_of_times, discount, status, type, id]
    );
    res.json({ message: "Promo code updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deltePromocodes = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM promo_codes WHERE id=?", [id]);
    res.json({ message: "Promo code deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
