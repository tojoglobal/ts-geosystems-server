import path from "path";
import db from "../../Utils/db.js";
import fs from "fs";
import { deleteFileFromUploads } from "./../../Utils/deleteFileFromUploads.js";

export const GetAllSlides = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM slides ORDER BY slide_number");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

export const UpdateSlides = async (req, res) => {
  const { id } = req.params;
  const { productName, productLink, productDescription } = req.body;

  // New image if uploaded
  const newImage = req.file;

  try {
    // Get existing image URL from DB
    const [[existingSlide]] = await db.query(
      "SELECT image_url FROM slides WHERE slide_number = ?",
      [id]
    );

    let imageUrl = existingSlide?.image_url;

    // If a new image was uploaded
    if (newImage) {
      const imagePath = `/uploads/${newImage.filename}`;
      // Delete the old image if exists and stored locally
      if (imageUrl && imageUrl.startsWith("/uploads/")) {
        deleteFileFromUploads(imageUrl);
      }

      imageUrl = imagePath; // update to new image path
    }

    // Update slide info in DB
    await db.query(
      `UPDATE slides 
       SET product_name = ?, product_link = ?, product_description = ?, image_url = ?
       WHERE slide_number = ?`,
      [productName, productLink, productDescription, imageUrl, id]
    );

    res.json({ message: `Slide ${id} updated successfully`, imageUrl });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};
