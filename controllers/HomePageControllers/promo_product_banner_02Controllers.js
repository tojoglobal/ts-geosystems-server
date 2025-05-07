import fs from "fs";
import path from "path";
import db from "../../Utils/db.js";

export const getUploadImages = async (req, res) => {
  try {
    const [result] = await db.execute(
      "SELECT * FROM promo_product_banner_02_image"
    );
    res.status(200).send({
      message: "Image send done ",
      total: result.length,
      data: result,
    });
  } catch (error) {}
};

export const uploadImages = async (req, res) => {
  try {
    const images = req.files;
    const uploaded = [];

    for (let i = 0; i < images.length; i++) {
      const { filename } = images[i];
      const url = `/uploads/${filename}`;
      const [result] = await db.execute(
        "INSERT INTO promo_product_banner_02_image (photourl, `order`) VALUES (?, ?)",
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

export const deleteImage = async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.execute(
      "SELECT photourl FROM promo_product_banner_02_image WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Image not found" });

    const photo = rows[0]?.photourl;
    // Delete photo file
    if (photo) {
      const fileName = photo.replace(/^\/?uploads\//, "");
      const filePath = path.join("uploads", fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.execute("DELETE FROM promo_product_banner_02_image WHERE id = ?", [
      id,
    ]);
    res.json({ message: "Image deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Delete failed" });
  }
};

export const updateImageOrder = async (req, res) => {
  const { images } = req.body;

  try {
    for (const { id, order } of images) {
      await db.execute(
        "UPDATE promo_product_banner_02_image SET `order` = ? WHERE id = ?",
        [order, id]
      );
    }

    res.json({ message: "Order updated" });
  } catch (error) {
    console.error("Order update error:", error);
    res.status(500).json({ error: "Order update failed" });
  }
};
