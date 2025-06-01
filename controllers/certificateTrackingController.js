import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

// GET
export const getCertificateTracking = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM certificate_tracking LIMIT 1");
    if (!rows.length) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT
export const updateCertificateTracking = async (req, res) => {
  try {
    const {
      title,
      description,
      tracking_title,
      tracking_description,
      image_url: oldImageUrl,
    } = req.body;

    let image_url = oldImageUrl;
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const newFilename = `certificate-banner-${Date.now()}${ext}`;
      const newPath = path.join("uploads", newFilename);
      fs.renameSync(req.file.path, newPath);
      image_url = `/uploads/${newFilename}`;
      // Optionally delete old image
      if (
        oldImageUrl &&
        !oldImageUrl.includes("certificate-banner.jpg") &&
        fs.existsSync(path.join("public", oldImageUrl))
      ) {
        fs.unlinkSync(path.join("public", oldImageUrl));
      }
    }

    const [existing] = await db.query(
      "SELECT id FROM certificate_tracking LIMIT 1"
    );
    if (!existing.length) {
      await db.query(
        `INSERT INTO certificate_tracking (title, description, tracking_title, tracking_description, image_url)
         VALUES (?, ?, ?, ?, ?)`,
        [title, description, tracking_title, tracking_description, image_url]
      );
    } else {
      await db.query(
        `UPDATE certificate_tracking SET
          title = ?, description = ?, tracking_title = ?, tracking_description = ?, image_url = ?
        WHERE id = ?`,
        [
          title,
          description,
          tracking_title,
          tracking_description,
          image_url,
          existing[0].id,
        ]
      );
    }

    res.json({
      success: true,
      message: "Certificate tracking content updated successfully",
      image_url,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
};
