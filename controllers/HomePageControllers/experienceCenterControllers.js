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
    const uploaded = [];

    // First delete all existing images (since we only want exactly 3)
    const [existing] = await db.execute(
      "SELECT * FROM experience_center_images"
    );
    for (const img of existing) {
      const fileName = img.photourl.replace(/^\/?uploads\//, "");
      const filePath = path.join("uploads", fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.execute("DELETE FROM experience_center_images");

    // Upload new images
    for (let i = 0; i < Math.min(images.length, 3); i++) {
      const { filename } = images[i];
      const url = `/uploads/${filename}`;
      const [result] = await db.execute(
        "INSERT INTO experience_center_images (photourl, `order`) VALUES (?, ?)",
        [url, i]
      );
      uploaded.push({ id: result.insertId, url, order: i });
    }

    res.status(201).json(uploaded);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};
