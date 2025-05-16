import db from "../../Utils/db.js";
import fs from "fs";
import path from "path";

export const Put_homepage_single_images = async (req, res) => {
  const { id } = req.params;
  const newImageUrl = `/uploads/${req.file.filename}`;
  try {
    // Fetch old image URL
    const [rows] = await db.query(
      "SELECT imageUrl FROM home_page_single_images WHERE id = ?",
      [id]
    );
    const photo = rows[0]?.imageUrl;

    // Delete photo file
    if (photo) {
      const fileName = photo.replace(/^\/?uploads\//, "");
      const filePath = path.join("uploads", fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Update new image URL
    await db.query(
      "UPDATE home_page_single_images SET imageUrl = ?, updateDate = NOW() WHERE id = ?",
      [newImageUrl, id]
    );

    res.json({ success: true, imageUrl: newImageUrl });
  } catch (err) {
    res.status(500).json({ error: "Database or filesystem error" });
  }
};

export const get_homepage_single_images = async (req, res) => {
  try {
    const [result] = await db.execute("SELECT * FROM home_page_single_images");
    res.status(200).send({
      message: "Image send done ",
      total: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Image send faild" });
  }
};
