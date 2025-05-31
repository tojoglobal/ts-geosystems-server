import fs from "fs";
import path from "path";
import db from "../../Utils/db.js";

// Get all last banner images
export const getLastBannerImages = async (req, res) => {
  try {
    const [result] = await db.execute(
      "SELECT * FROM last_banner_images ORDER BY `order` ASC"
    );
    res.status(200).send({
      message: "Images fetched successfully",
      total: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

// Upload last banner images (max 2)
export const uploadLastBannerImages = async (req, res) => {
  try {
    const images = req.files;
    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    const [existing] = await db.execute("SELECT * FROM last_banner_images");
    const availableSlots = 2 - existing.length;

    if (availableSlots <= 0) {
      return res.status(400).json({ error: "Maximum 2 images already exist" });
    }

    const uploaded = [];
    const imagesToUpload = Math.min(images.length, availableSlots);

    for (let i = 0; i < imagesToUpload; i++) {
      const { filename } = images[i];
      const url = `/uploads/${filename}`;
      const [result] = await db.execute(
        "INSERT INTO last_banner_images (photourl, `order`) VALUES (?, ?)",
        [url, existing.length + i]
      );
      uploaded.push({ id: result.insertId, url, order: existing.length + i });
    }

    res.status(201).json(uploaded);
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
};

// Delete a banner image and reorder
export const deleteLastBannerImage = async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.execute(
      "SELECT photourl FROM last_banner_images WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const photo = rows[0]?.photourl;
    if (photo) {
      const fileName = photo.replace(/^\/?uploads\//, "");
      const filePath = path.join("uploads", fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.execute("DELETE FROM last_banner_images WHERE id = ?", [id]);

    // Reorder remaining images
    const [remaining] = await db.execute(
      "SELECT * FROM last_banner_images ORDER BY `order` ASC"
    );
    for (let i = 0; i < remaining.length; i++) {
      await db.execute(
        "UPDATE last_banner_images SET `order` = ? WHERE id = ?",
        [i, remaining[i].id]
      );
    }

    res.json({ message: "Image deleted and order updated" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};
