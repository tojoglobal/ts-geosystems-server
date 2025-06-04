import db from "../Utils/db.js";

// CREATE
export const postClient = async (req, res) => {
  const { companyName, ownerName, mobileNumber, address } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO ts_clients
        (companyName, ownerName, mobileNumber, address, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [companyName, ownerName, mobileNumber, address]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ (with optional mobileNumber search)
export const getClients = async (req, res) => {
  const { mobileNumber } = req.query;
  try {
    if (mobileNumber) {
      const [rows] = await db.query(
        "SELECT * FROM ts_clients WHERE mobileNumber LIKE ? ORDER BY id DESC",
        [`%${mobileNumber}%`]
      );
      res.status(200).json(rows);
    } else {
      const [rows] = await db.query(
        "SELECT * FROM ts_clients ORDER BY id DESC"
      );
      res.status(200).json(rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const putClient = async (req, res) => {
  const { id } = req.params;
  const { companyName, ownerName, mobileNumber, address } = req.body;
  try {
    await db.query(
      `UPDATE ts_clients SET companyName=?, ownerName=?, mobileNumber=?, address=?, updated_at=NOW()
       WHERE id=?`,
      [companyName, ownerName, mobileNumber, address, id]
    );
    res.json({ message: "Client updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM ts_clients WHERE id=?", [id]);
    res.json({ message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
