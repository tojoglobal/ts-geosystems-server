import fs from "fs/promises";
import path from "path";
import db from "../Utils/db.js";

// GET all softwares
export const getSoftwares = async (req, res) => {
  try {
    const [softwares] = await db.query(
      "SELECT * FROM softwares ORDER BY id DESC"
    );
    res.json(softwares);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE a new software
export const createSoftware = async (req, res) => {
  try {
    const body = { ...req.body };
    const { softwar_name, softwarlink } = body;
    const photo = req.file ? req.file.filename : null;
    const slug = softwar_name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const sql = `
      INSERT INTO softwares (softwar_name, slug, softwarlink, photo)
      VALUES (?, ?, ?, ?)
    `;
    const values = [softwar_name, slug, softwarlink, photo];

    const [result] = await db.query(sql, values);

    res.json({ message: "Software created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a software
export const updateSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    const { softwar_name, softwarlink } = req.body;
    const newPhoto = req.file ? req.file.filename : null;
    const slug = softwar_name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Get old photo
    const [rows] = await db.query("SELECT photo FROM softwares WHERE id = ?", [
      id,
    ]);
    const oldPhoto = rows[0]?.photo;

    let updateFields = "softwar_name=?, slug=?, softwarlink=?";
    let values = [softwar_name, slug, softwarlink];

    if (newPhoto) {
      updateFields += ", photo=?";
      values.push(newPhoto);
    } else {
      updateFields += ", photo=?";
      values.push(oldPhoto);
    }

    values.push(id);

    const sql = `UPDATE softwares SET ${updateFields} WHERE id = ?`;
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

    res.json({ message: "Software updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE a software
export const deleteSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    // Get photo
    const [rows] = await db.query("SELECT photo FROM softwares WHERE id = ?", [
      id,
    ]);
    const photo = rows[0]?.photo;

    // Delete software
    await db.query("DELETE FROM softwares WHERE id = ?", [id]);

    // Delete photo file
    if (photo) {
      const imagePath = path.join("uploads", photo);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error("Failed to delete image:", err.message);
      }
    }

    res.json({ message: "Software deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
