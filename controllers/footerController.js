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
    let { address1, address2, mailing_title, mailing_text, bg_color } =
      req.body;

    // Array to hold the final URLs for each image slot
    const final_iso_image_urls = ["", "", ""];
    // Array to hold the old URLs for each image slot, from request body
    const old_iso_image_urls_from_frontend = [];

    // Extract old image URLs and process new/removed images
    for (let i = 1; i <= 3; i++) {
      const oldUrlKey = `old_iso_image_url_${i}`;
      const removeKey = `remove_iso_image_${i}`;
      const newFileKey = `iso_image_${i}`; // This corresponds to req.files if using upload.array, but here it's still single for multer
      const existingUrlKey = `iso_image_url_${i}`; // This is sent when no change

      const oldUrl = req.body[oldUrlKey] || "";
      old_iso_image_urls_from_frontend[i - 1] = oldUrl;

      // Check if a new file for this specific slot was uploaded
      // Multer with upload.single will have req.file for the *last* file if multiple fields with same name are allowed,
      // or specific files for different field names.
      // If you're using upload.single("iso_image_1"), upload.single("iso_image_2"), etc., you'll need separate middleware
      // OR a different multer configuration (e.g., upload.fields([{ name: 'iso_image_1' }, ...]))
      // For simplicity, assuming `req.files` would contain an array if `upload.array` was used,
      // or `req.file` for the *first* matched field if `upload.single` is used multiple times.
      // A more robust solution for multiple fields is `upload.fields`.

      // Let's adapt for `upload.single` on different field names
      const file =
        req.files && req.files[newFileKey] ? req.files[newFileKey][0] : null;

      // If `upload.single("iso_image")` was used and you're sending `iso_image_1`, `iso_image_2` etc.
      // `req.file` will only contain the file for the *last* field named `iso_image` encountered by multer.
      // To handle distinct fields like `iso_image_1`, `iso_image_2`, `iso_image_3`, you need `upload.fields`.

      // --- CRITICAL: Adjust Multer configuration ---
      // For this to work correctly, your `footerRoute.js` and `UploadFile.js` MUST use `upload.fields`
      // instead of `upload.single`. I'll show how to adapt in the `footerRoute.js` section.
      // Assuming `req.files` will be an object where keys are field names (e.g., 'iso_image_1')
      // and values are arrays of files for that field (since it could be multiple, but we expect one).

      let currentFile = null;
      if (
        req.files &&
        req.files[`iso_image_${i}`] &&
        req.files[`iso_image_${i}`].length > 0
      ) {
        currentFile = req.files[`iso_image_${i}`][0];
      }

      // Scenario 1: A new image file is uploaded for this slot
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

        // Remove old file if it exists and is not the default
        if (
          oldUrl &&
          !oldUrl.includes("ISO-WHITE.png") &&
          fs.existsSync(path.join("public", oldUrl))
        ) {
          fs.unlinkSync(path.join("public", oldUrl));
        }
      }
      // Scenario 2: User explicitly wants to remove the image for this slot
      else if (req.body[removeKey] === "true") {
        final_iso_image_urls[i - 1] = ""; // Clear the URL
        // Delete the old file from the server
        if (
          oldUrl &&
          !oldUrl.includes("ISO-WHITE.png") &&
          fs.existsSync(path.join("public", oldUrl))
        ) {
          fs.unlinkSync(path.join("public", oldUrl));
        }
      }
      // Scenario 3: No new image, and not explicitly removed (keep existing)
      else {
        // Use the URL that the frontend sent, which could be the old one or empty
        final_iso_image_urls[i - 1] = req.body[existingUrlKey] || "";
      }
    }

    // Update DB
    const [existing] = await db.query("SELECT id FROM footer LIMIT 1");
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO footer (address1, address2, mailing_title, mailing_text, bg_color, iso_image_url_1, iso_image_url_2, iso_image_url_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          address1,
          address2,
          mailing_title,
          mailing_text,
          bg_color,
          final_iso_image_urls[0],
          final_iso_image_urls[1],
          final_iso_image_urls[2],
        ]
      );
    } else {
      await db.query(
        `UPDATE footer SET address1=?, address2=?, mailing_title=?, mailing_text=?, bg_color=?, iso_image_url_1=?, iso_image_url_2=?, iso_image_url_3=? WHERE id=?`,
        [
          address1,
          address2,
          mailing_title,
          mailing_text,
          bg_color,
          final_iso_image_urls[0],
          final_iso_image_urls[1],
          final_iso_image_urls[2],
          existing[0].id,
        ]
      );
    }

    res.json({
      success: true,
      message: "Footer updated successfully",
      iso_image_url_1: final_iso_image_urls[0], // Return updated URLs
      iso_image_url_2: final_iso_image_urls[1],
      iso_image_url_3: final_iso_image_urls[2],
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
    console.error("Backend update error:", err); // Log the full error for debugging
    res.status(500).json({ success: false, message: err.message });
  }
};
