import db from "../Utils/db.js";

// create the
export const postPromocodes = async (req, res) => {
  const { title, code_name, no_of_times, discount, status, type } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO promo_codes (title, code_name, no_of_times,uses_time, discount, status, type, created_at, updated_at)
       VALUES (?, ?, ?,0, ?, ?, ?, NOW(), NOW())`,
      [title, code_name, no_of_times, discount, status, type]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get the promocode
export const getPromocodes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM promo_codes ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update the promocode
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

// admin delete the promo codes
export const deltePromocodes = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM promo_codes WHERE id=?", [id]);
    res.json({ message: "Promo code deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// when apply the promocode
export const applyPromocode = async (req, res) => {
  const { code_name } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT * FROM promo_codes WHERE code_name = ?",
      [code_name]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Invalid code" });

    const promo = rows[0];

    if (promo.uses_time >= promo.no_of_times) {
      return res
        .status(400)
        .json({ message: "Promo code usage limit reached" });
    }

    if (promo.status !== 1) {
      return res.status(400).json({ message: "Promo code is inactive" });
    }

    return res.json({
      code_name: promo.code_name,
      discount: promo.discount,
      type: promo.type, // 'flat' or 'percentage'
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
