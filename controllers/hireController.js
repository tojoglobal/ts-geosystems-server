import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

export const getHire = async (req, res) => {
  try {
    const [hireContent] = await db.query("SELECT * FROM hire LIMIT 1");

    if (hireContent.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hire content not found",
      });
    }

    // Send only necessary data
    const { title, description, infoBox, imageUrl } = hireContent[0];
    res.status(200).json({
      success: true,
      data: { title, description, infoBox, imageUrl },
    });
  } catch (error) {
    console.error("Error fetching hire content:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateHire = async (req, res) => {
  try {
    const { title, description, infoBox } = req.body;
    let imageUrl = req.body.imageUrl;

    // If a new image was uploaded
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const newFilename = `hire-banner-${Date.now()}${fileExtension}`;
      const newPath = path.join("uploads", "hire", newFilename);

      // Rename/move the file
      fs.renameSync(req.file.path, newPath);

      // Set the new image URL
      imageUrl = `/uploads/hire/${newFilename}`;

      // Clean up the old image if it exists
      if (
        req.body.oldImageUrl &&
        !req.body.oldImageUrl.includes("banner-hire-page-a.jpg") &&
        fs.existsSync(path.join("public", req.body.oldImageUrl))
      ) {
        fs.unlinkSync(path.join("public", req.body.oldImageUrl));
      }
    }

    if (!title || !description || !infoBox) {
      return res.status(400).json({
        message: "Title, description and info box are required",
      });
    }

    // Check if any record exists
    const [existing] = await db.query("SELECT id FROM hire LIMIT 1");

    if (existing.length === 0) {
      // If no record exists, insert new record
      await db.query(
        "INSERT INTO hire (title, description, infoBox, imageUrl) VALUES (?, ?, ?, ?)",
        [title, description, infoBox, imageUrl]
      );
    } else {
      // If record exists, update it
      await db.query(
        "UPDATE hire SET title = ?, description = ?, infoBox = ?, imageUrl = ? WHERE id = ?",
        [title, description, infoBox, imageUrl, existing[0].id]
      );
    }

    res.json({
      success: true,
      message: "Hire content updated successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Error updating hire content:", error);

    // Clean up the uploaded file if something went wrong
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
