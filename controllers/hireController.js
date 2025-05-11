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

    // Parse the links JSON if it exists
    let links = null;
    if (hireContent[0].links) {
      try {
        links =
          typeof hireContent[0].links === "string"
            ? JSON.parse(hireContent[0].links)
            : hireContent[0].links;
      } catch (e) {
        console.error("Error parsing links:", e);
        links = null;
      }
    }

    const { title, description, infoBox, imageUrl } = hireContent[0];
    res.status(200).json({
      success: true,
      data: { title, description, infoBox, imageUrl, links },
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
    let links = req.body.links;

    // Parse the links if it's a string
    if (typeof links === "string") {
      try {
        links = JSON.parse(links);
      } catch (e) {
        console.error("Error parsing links:", e);
        links = null;
      }
    }

    // If a new image was uploaded
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const newFilename = `hire-banner-${Date.now()}${fileExtension}`;
      const newPath = path.join("uploads", "hire", newFilename);

      fs.renameSync(req.file.path, newPath);
      imageUrl = `/uploads/hire/${newFilename}`;

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

    // Stringify the links object for database storage
    const linksString = links ? JSON.stringify(links) : null;

    // Check if any record exists
    const [existing] = await db.query("SELECT id FROM hire LIMIT 1");

    if (existing.length === 0) {
      await db.query(
        "INSERT INTO hire (title, description, infoBox, imageUrl, links) VALUES (?, ?, ?, ?, ?)",
        [title, description, infoBox, imageUrl, linksString]
      );
    } else {
      await db.query(
        "UPDATE hire SET title = ?, description = ?, infoBox = ?, imageUrl = ?, links = ? WHERE id = ?",
        [title, description, infoBox, imageUrl, linksString, existing[0].id]
      );
    }

    res.json({
      success: true,
      message: "Hire content updated successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Error updating hire content:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
