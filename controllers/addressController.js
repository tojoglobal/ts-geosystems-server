import db from "../Utils/db.js";

// Get all addresses for logged-in user
export const getAddresses = async (req, res) => {
  const userId = req.user.id;
  const [addresses] = await db.query(
    "SELECT * FROM addresses WHERE user_id = ?",
    [userId]
  );
  res.json(addresses);
};

// Add new address for logged-in user
export const addAddress = async (req, res) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    company,
    addressLine1,
    addressLine2,
    city,
    state,
    postcode,
    country,
    phone,
  } = req.body;
  await db.query(
    `INSERT INTO addresses (user_id, first_name, last_name, company, address_line_1, address_line_2, city, state, postcode, country, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      firstName,
      lastName,
      company,
      addressLine1,
      addressLine2,
      city,
      state,
      postcode,
      country,
      phone,
    ]
  );
  res.status(201).json({ message: "Address added!" });
};

// Edit address (only if belongs to logged-in user)
export const updateAddress = async (req, res) => {
  const userId = req.user.id;
  const {
    id,
    firstName,
    lastName,
    company,
    addressLine1,
    addressLine2,
    city,
    state,
    postcode,
    country,
    phone,
  } = req.body;
  const [result] = await db.query(
    `UPDATE addresses SET first_name=?, last_name=?, company=?, address_line_1=?, address_line_2=?, city=?, state=?, postcode=?, country=?, phone=?
    WHERE id=? AND user_id=?`,
    [
      firstName,
      lastName,
      company,
      addressLine1,
      addressLine2,
      city,
      state,
      postcode,
      country,
      phone,
      id,
      userId,
    ]
  );
  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Address not found" });
  res.json({ message: "Address updated!" });
};

// Delete address
export const deleteAddress = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const [result] = await db.query(
    "DELETE FROM addresses WHERE id=? AND user_id=?",
    [id, userId]
  );
  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Address not found" });
  res.json({ message: "Address deleted!" });
};
