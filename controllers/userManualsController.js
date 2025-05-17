import fs from "fs/promises";
import path from "path";
import db from "../Utils/db.js";

// GET all UserManualss
export const getUserManuals = async (req, res) => {
  try {
    const [UserManuals] = await db.query(
      "SELECT * FROM user_manuals ORDER BY id DESC"
    );
    res.status(200).json(UserManuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE a new UserManuals
export const createUserManuals = async (req, res) => {
  try {
    const body = { ...req.body };
    const { userManuals_name, userManualslink } = body;
    const photo = req.file ? req.file.filename : null;
    const slug = userManuals_name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const sql = `
      INSERT INTO user_manuals (user_manuals_name, slug, user_manuals_link, photo)
      VALUES (?, ?, ?, ?)
    `;
    const values = [userManuals_name, slug, userManualslink, photo];
    await db.query(sql, values);
    res.json({ message: "UserManuals created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a UserManuals
export const updateUserManuals = async (req, res) => {
  try {
    const { id } = req.params;

    const { userManuals_name, userManualslink } = req.body;
    const newPhoto = req.file ? req.file.filename : null;
    const slug = userManuals_name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Get old photo
    const [rows] = await db.query(
      "SELECT photo FROM user_manuals WHERE id = ?",
      [id]
    );
    const oldPhoto = rows[0]?.photo;
    console.log(rows);

    let updateFields = "user_manuals_name=?, slug=?, user_manuals_link=?";
    let values = [userManuals_name, slug, userManualslink];

    if (newPhoto) {
      updateFields += ", photo=?";
      values.push(newPhoto);
    } else {
      updateFields += ", photo=?";
      values.push(oldPhoto);
    }

    values.push(id);

    const sql = `UPDATE user_manuals SET ${updateFields} WHERE id = ?`;
    await db.query(sql, values);

    // If new photo uploaded, delete old photo
    if (newPhoto && oldPhoto) {
      const oldImagePath = path.join("uploads", oldPhoto);
      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        console.error("Failed to delete old image:", err.message);
      }
    }

    res.status(200).json({ message: "UserManuals updated successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

// DELETE a UserManuals
export const deleteUserManuals = async (req, res) => {
  try {
    const { id } = req.params;
    // Get photo
    const [rows] = await db.query(
      "SELECT photo FROM user_manuals WHERE id = ?",
      [id]
    );

    const photo = rows[0]?.photo;

    // Delete UserManuals
    await db.query("DELETE FROM user_manuals WHERE id = ?", [id]);

    // Delete photo file
    if (photo) {
      const imagePath = path.join("uploads", photo);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error("Failed to delete image:", err.message);
      }
    }

    res.status(200).json({ message: "UserManuals deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};
