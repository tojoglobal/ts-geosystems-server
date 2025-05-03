import db from "../Utils/db.js";

export const postTaxes = async (req, res) => {
  const { name, value, status } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO taxes (name, value, status, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [name, value, status]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTaxes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM taxes ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const putTaxes = async (req, res) => {
  const { id } = req.params;
  const { name, value, status } = req.body;
  try {
    await db.query(
      `UPDATE taxes SET name=?, value=?, status=?, updated_at=NOW() WHERE id=?`,
      [name, value, status, id]
    );
    res.json({ message: "Tax updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTaxes = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM taxes WHERE id=?", [id]);
    res.json({ message: "Tax deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
