import db from "../Utils/db.js";

// Create new shipping cost
export const postShippingCost = async (req, res) => {
  const { name, amount, status } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO shipping_costs (name, amount, status, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [name, amount, status]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all shipping costs
export const getShippingCosts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM shipping_costs ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update shipping cost
export const putShippingCost = async (req, res) => {
  const { id } = req.params;
  const { name, amount, status } = req.body;
  try {
    await db.query(
      `UPDATE shipping_costs SET name=?, amount=?, status=?, updated_at=NOW() WHERE id=?`,
      [name, amount, status, id]
    );
    res.json({ message: "Shipping cost updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete shipping cost
export const deleteShippingCost = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM shipping_costs WHERE id=?", [id]);
    res.json({ message: "Shipping cost deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
