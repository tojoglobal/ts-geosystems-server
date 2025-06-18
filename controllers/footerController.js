import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

// Get Footer (unchanged)
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
    let { address1, address2, mailing_title, mailing_text, bg_color } =
      req.body;

    // ISO IMAGES (as before)
    const final_iso_image_urls = ["", "", ""];
    const old_iso_image_urls_from_frontend = [];
    for (let i = 1; i <= 3; i++) {
      const oldUrlKey = `old_iso_image_url_${i}`;
      const removeKey = `remove_iso_image_${i}`;
      const newFileKey = `iso_image_${i}`;
      const existingUrlKey = `iso_image_url_${i}`;

      const oldUrl = req.body[oldUrlKey] || "";
      old_iso_image_urls_from_frontend[i - 1] = oldUrl;

      let currentFile = null;
      if (
        req.files &&
        req.files[`iso_image_${i}`] &&
        req.files[`iso_image_${i}`].length > 0
      ) {
        currentFile = req.files[`iso_image_${i}`][0];
      }

      if (currentFile && currentFile.size > 0) {
        const fileExtension = path
          .extname(currentFile.originalname)
          .toLowerCase();
        const uploadsDir = path.join("uploads", "footer");
        const newFilename = `footer-iso-${i}-${Date.now()}${fileExtension}`;
        const newPath = path.join(uploadsDir, newFilename);

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        fs.renameSync(currentFile.path, newPath);
        final_iso_image_urls[i - 1] = `/uploads/footer/${newFilename}`;

        if (
          oldUrl &&
          !oldUrl.includes("ISO-WHITE.png") &&
          fs.existsSync(path.join("public", oldUrl))
        ) {
          fs.unlinkSync(path.join("public", oldUrl));
        }
      } else if (req.body[removeKey] === "true") {
        final_iso_image_urls[i - 1] = "";
        if (
          oldUrl &&
          !oldUrl.includes("ISO-WHITE.png") &&
          fs.existsSync(path.join("public", oldUrl))
        ) {
          fs.unlinkSync(path.join("public", oldUrl));
        }
      } else {
        final_iso_image_urls[i - 1] = req.body[existingUrlKey] || "";
      }
    }

    // PAYMENT METHOD IMAGE (new block)
    let payment_method_image_url = req.body.payment_method_image_url || "";
    const paymentOldUrl = req.body.old_payment_method_image_url || "";
    const paymentFile =
      req.files &&
      req.files["payment_method_image"] &&
      req.files["payment_method_image"][0]
        ? req.files["payment_method_image"][0]
        : null;

    if (paymentFile && paymentFile.size > 0) {
      const fileExtension = path
        .extname(paymentFile.originalname)
        .toLowerCase();
      const uploadsDir = path.join("uploads", "footer");
      const newFilename = `footer-payment-method-${Date.now()}${fileExtension}`;
      const newPath = path.join(uploadsDir, newFilename);

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      fs.renameSync(paymentFile.path, newPath);
      payment_method_image_url = `/uploads/footer/${newFilename}`;

      if (
        paymentOldUrl &&
        !paymentOldUrl.includes("default-payment-method") &&
        fs.existsSync(path.join("public", paymentOldUrl))
      ) {
        fs.unlinkSync(path.join("public", paymentOldUrl));
      }
    } else if (req.body.remove_payment_method_image === "true") {
      payment_method_image_url = "";
      if (
        paymentOldUrl &&
        !paymentOldUrl.includes("default-payment-method") &&
        fs.existsSync(path.join("public", paymentOldUrl))
      ) {
        fs.unlinkSync(path.join("public", paymentOldUrl));
      }
    } // else keep as is from req.body.payment_method_image_url

    // Update or Insert
    const [existing] = await db.query("SELECT id FROM footer LIMIT 1");
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO footer (address1, address2, mailing_title, mailing_text, bg_color, iso_image_url_1, iso_image_url_2, iso_image_url_3, payment_method_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          address1,
          address2,
          mailing_title,
          mailing_text,
          bg_color,
          final_iso_image_urls[0],
          final_iso_image_urls[1],
          final_iso_image_urls[2],
          payment_method_image_url,
        ]
      );
    } else {
      await db.query(
        `UPDATE footer SET address1=?, address2=?, mailing_title=?, mailing_text=?, bg_color=?, iso_image_url_1=?, iso_image_url_2=?, iso_image_url_3=?, payment_method_image_url=? WHERE id=?`,
        [
          address1,
          address2,
          mailing_title,
          mailing_text,
          bg_color,
          final_iso_image_urls[0],
          final_iso_image_urls[1],
          final_iso_image_urls[2],
          payment_method_image_url,
          existing[0].id,
        ]
      );
    }

    res.json({
      success: true,
      message: "Footer updated successfully",
      iso_image_url_1: final_iso_image_urls[0],
      iso_image_url_2: final_iso_image_urls[1],
      iso_image_url_3: final_iso_image_urls[2],
      payment_method_image_url,
    });
  } catch (err) {
    // Clean up any newly uploaded files in case of error
    if (req.files) {
      for (const fieldName in req.files) {
        req.files[fieldName].forEach((file) => {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
    }
    console.error("Backend update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
