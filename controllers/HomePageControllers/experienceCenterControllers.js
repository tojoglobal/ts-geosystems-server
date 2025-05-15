import fs from "fs";
import path from "path";
import db from "../../Utils/db.js";

export const getExperienceCenterImages = async (req, res) => {
  try {
    const [result] = await db.execute(
      "SELECT * FROM experience_center_images ORDER BY `order` ASC"
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

export const uploadExperienceCenterImages = async (req, res) => {
  try {
    const images = req.files;
    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    // Get current images to know how many slots are available
    const [existing] = await db.execute(
      "SELECT * FROM experience_center_images"
    );
    const availableSlots = 3 - existing.length;

    if (availableSlots <= 0) {
      return res.status(400).json({ error: "Maximum 3 images already exist" });
    }

    const uploaded = [];
    const imagesToUpload = Math.min(images.length, availableSlots);

    for (let i = 0; i < imagesToUpload; i++) {
      const { filename } = images[i];
      const url = `/uploads/${filename}`;
      const [result] = await db.execute(
        "INSERT INTO experience_center_images (photourl, `order`) VALUES (?, ?)",
        [url, existing.length + i]
      );
      uploaded.push({ id: result.insertId, url, order: existing.length + i });
    }

    res.status(201).json(uploaded);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};

export const deleteExperienceCenterImage = async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.execute(
      "SELECT photourl FROM experience_center_images WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const photo = rows[0]?.photourl;
    // Delete photo file
    if (photo) {
      const fileName = photo.replace(/^\/?uploads\//, "");
      const filePath = path.join("uploads", fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.execute("DELETE FROM experience_center_images WHERE id = ?", [id]);

    // Reorder remaining images
    const [remaining] = await db.execute(
      "SELECT * FROM experience_center_images ORDER BY `order` ASC"
    );
    for (let i = 0; i < remaining.length; i++) {
      await db.execute(
        "UPDATE experience_center_images SET `order` = ? WHERE id = ?",
        [i, remaining[i].id]
      );
    }

    res.json({ message: "Image deleted and order updated" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Delete failed" });
  }
};
