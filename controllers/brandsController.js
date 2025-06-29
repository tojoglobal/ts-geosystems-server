import fs from "fs/promises";
import path from "path";
import db from "../Utils/db.js";

// Helper for slug
function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// GET all brands
export const getBrands = async (req, res) => {
  try {
    const [brands] = await db.query("SELECT * FROM brands ORDER BY id DESC");
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE a new brand
export const createBrand = async (req, res) => {
  try {
    const { brands_name, status, is_populer, home_page_show } = req.body;
    const photo = req.file ? req.file.filename : null;
    const slug = makeSlug(brands_name);

    const sql = `
      INSERT INTO brands (brands_name, slug, photo, status, is_populer, home_page_show)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      brands_name,
      slug,
      photo,
      status,
      is_populer,
      home_page_show,
    ];
    await db.query(sql, values);

    res.json({ message: "Brand created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a brand
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { brands_name, status, is_populer, home_page_show } = req.body;
    const newPhoto = req.file ? req.file.filename : null;
    const slug = makeSlug(brands_name);

    // Get old photo
    const [rows] = await db.query("SELECT photo FROM brands WHERE id = ?", [
      id,
    ]);
    const oldPhoto = rows[0]?.photo;

    let updateFields =
      "brands_name=?, slug=?, status=?, is_populer=?, home_page_show=?";
    let values = [brands_name, slug, status, is_populer, home_page_show];

    updateFields += ", photo=?";
    values.push(newPhoto ? newPhoto : oldPhoto);

    values.push(id);

    const sql = `UPDATE brands SET ${updateFields} WHERE id = ?`;
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
    res.json({ message: "Brand updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE a brand
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    // Get photo
    const [rows] = await db.query("SELECT photo FROM brands WHERE id = ?", [
      id,
    ]);
    const photo = rows[0]?.photo;
    // Delete brand
    await db.query("DELETE FROM brands WHERE id = ?", [id]);
    // Delete photo file
    if (photo) {
      const imagePath = path.join("uploads", photo);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error("Failed to delete image:", err.message);
      }
    }

    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// For category product sidebar image as brand image
export const getPopularBrandPhoto = async (req, res) => {
  try {
    const [brands] = await db.query(
      "SELECT photo FROM brands WHERE is_populer = 1 AND status = 1 ORDER BY id DESC "
    );
    if (!brands.length) {
      return res.status(404).json({ message: "No popular brand found" });
    }
    res.status(200).json({ photos: brands.map((b) => b.photo) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// For home page brand photos
export const getHomeBrandPhoto = async (req, res) => {
  try {
    const [brands] = await db.query(
      "SELECT id, brands_name, slug, photo FROM brands WHERE home_page_show = 1 AND status = 1 ORDER BY id DESC"
    );
    if (!brands.length) {
      return res
        .status(404)
        .json({ success: false, message: "No home brand found" });
    }
    res.status(200).json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
