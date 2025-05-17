import fs from "fs/promises";
import path from "path";
import db from "../Utils/db.js";

// GET all QuickGuides
export const getQuickGuides = async (req, res) => {
  try {
    const [QuickGuides] = await db.query(
      "SELECT * FROM quick_guides ORDER BY id DESC"
    );
    res.status(200).json(QuickGuides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE a new QuickGuide
export const createQuickGuides = async (req, res) => {
  try {
    const body = { ...req.body };
    const { quickGuides_name, quickGuideslink } = body;
    const photo = req.file ? req.file.filename : null;
    const slug = quickGuides_name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const sql = `
      INSERT INTO quick_guides (quick_guides_name, slug, quick_guides_link, photo)
      VALUES (?, ?, ?, ?)
    `;
    const values = [quickGuides_name, slug, quickGuideslink, photo];
    await db.query(sql, values);
    res.json({ message: "QuickGuide created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a QuickGuide
export const updateQuickGuides = async (req, res) => {
  try {
    const { id } = req.params;
    const { quickGuides_name, quickGuideslink } = req.body;
    const newPhoto = req.file ? req.file.filename : null;
    const slug = quickGuides_name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Get old photo
    const [rows] = await db.query(
      "SELECT photo FROM quick_guides WHERE id = ?",
      [id]
    );
    const oldPhoto = rows[0]?.photo;

    let updateFields = "quick_guides_name=?, slug=?, quick_guides_link=?";
    let values = [quickGuides_name, slug, quickGuideslink];

    if (newPhoto) {
      updateFields += ", photo=?";
      values.push(newPhoto);
    } else {
      updateFields += ", photo=?";
      values.push(oldPhoto);
    }

    values.push(id);

    const sql = `UPDATE quick_guides SET ${updateFields} WHERE id = ?`;
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

    res.status(200).json({ message: "QuickGuide updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE a QuickGuide
export const deleteQuickGuides = async (req, res) => {
  try {
    const { id } = req.params;
    // Get photo
    const [rows] = await db.query(
      "SELECT photo FROM quick_guides WHERE id = ?",
      [id]
    );
    const photo = rows[0]?.photo;

    // Delete QuickGuide
    await db.query("DELETE FROM quick_guides WHERE id = ?", [id]);

    // Delete photo file
    if (photo) {
      const imagePath = path.join("uploads", photo);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error("Failed to delete image:", err.message);
      }
    }

    res.status(200).json({ message: "QuickGuide deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
