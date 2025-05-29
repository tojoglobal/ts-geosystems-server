import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

// Get Footer
export const getFooter = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM footer LIMIT 1");
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Footer content not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateFooter = async (req, res) => {
  try {
    let {
      address1,
      address2,
      mailing_title,
      mailing_text,
      bg_color,
      old_iso_image_url, // from frontend, always sent
    } = req.body;

    let iso_image_url = old_iso_image_url; // default: keep old image

    if (req.file && req.file.size > 0) {
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const uploadsDir = path.join("uploads", "footer");
      const newFilename = `footer-iso-${Date.now()}${fileExtension}`;
      const newPath = path.join(uploadsDir, newFilename);

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      fs.renameSync(req.file.path, newPath);
      iso_image_url = `/uploads/footer/${newFilename}`;

      // Remove old file unless default
      if (
        old_iso_image_url &&
        !old_iso_image_url.includes("ISO-WHITE.png") &&
        fs.existsSync(path.join("public", old_iso_image_url))
      ) {
        fs.unlinkSync(path.join("public", old_iso_image_url));
      }
    }

    // Update DB as before
    const [existing] = await db.query("SELECT id FROM footer LIMIT 1");
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO footer (address1, address2, iso_image_url, mailing_title, mailing_text, bg_color) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          address1,
          address2,
          iso_image_url,
          mailing_title,
          mailing_text,
          bg_color,
        ]
      );
    } else {
      await db.query(
        `UPDATE footer SET address1=?, address2=?, iso_image_url=?, mailing_title=?, mailing_text=?, bg_color=? WHERE id=?`,
        [
          address1,
          address2,
          iso_image_url,
          mailing_title,
          mailing_text,
          bg_color,
          existing[0].id,
        ]
      );
    }

    res.json({
      success: true,
      message: "Footer updated successfully",
      iso_image_url,
    });
  } catch (err) {
    if (req.file && req.file.size > 0 && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: err.message });
  }
};