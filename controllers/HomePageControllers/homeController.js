import db from "../../Utils/db.js";
import fs from "fs";
import path from "path";

export const getWeProvide = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM we_provide ORDER BY id ASC LIMIT 3"
    );

    const section_title = rows[0]?.section_title || "";

    const result = [];
    for (let i = 0; i < 3; i++) {
      const item = rows[i] || {
        id: i + 1,
        title: "",
        image: "",
        description: JSON.stringify([]),
      };
      try {
        item.description =
          typeof item.description === "string"
            ? JSON.parse(item.description)
            : item.description;
      } catch (e) {
        item.description = [];
      }
      result.push(item);
    }

    res.json({ section_title, items: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateWeProvide = async (req, res) => {
  try {
    const items = JSON.parse(req.body.items);
    const files = req.files || {}; // Usually an object, keys are input field names

    // Validate descriptions and ensure description is always an array
    for (const item of items) {
      if (!item.description) {
        throw new Error("Description is required");
      }
      if (!Array.isArray(item.description)) {
        item.description = [item.description];
      }
    }

    // Start DB transaction
    await db.query("START TRANSACTION");

    // Fetch existing items to preserve images if no new image uploaded
    const [currentItems] = await db.query(
      "SELECT * FROM we_provide ORDER BY id ASC LIMIT 3"
    );

    // Clear existing records
    await db.query("DELETE FROM we_provide");

    // Loop through items and insert new/updated data
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Default to old image or current item's image if no new file uploaded
      let imageUrl = item.oldImage || currentItems[i]?.image || "";

      // Fallback image if no image found
      if (!imageUrl) {
        imageUrl = "/uploads/we-provide/default-we-provide.jpg";
      }

      // Check if a new file is uploaded for this item
      // Assuming frontend sends files as: images[0], images[1], ...
      const fileArray = files[`images[${i}]`];
      const file = fileArray ? fileArray[0] : null;

      if (file) {
        const ext = path.extname(file.originalname).toLowerCase();
        const newFilename = `we-provide-${Date.now()}-${i}${ext}`;
        const uploadDir = path.join("uploads", "we-provide");

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const newPath = path.join(uploadDir, newFilename);
        fs.renameSync(file.path, newPath);

        // Delete old image if exists and is not default
        if (
          currentItems[i]?.image &&
          !currentItems[i].image.includes("default-we-provide") &&
          fs.existsSync(path.join("public", currentItems[i].image))
        ) {
          fs.unlinkSync(path.join("public", currentItems[i].image));
        }

        imageUrl = `/uploads/we-provide/${newFilename}`;
      }

      // Store description as JSON string
      const descriptionJson = JSON.stringify(item.description);

      // Insert new record
      // Insert new record WITH section_title
      await db.query(
        "INSERT INTO we_provide (title, image, description, section_title) VALUES (?, ?, ?, ?)",
        [
          item.title || "",
          imageUrl,
          descriptionJson,
          items[0]?.section_title || "",
        ]
      );
    }

    // Commit DB transaction
    await db.query("COMMIT");

    res.json({ success: true, message: "We Provide updated successfully" });
  } catch (error) {
    // Rollback transaction if any error
    await db.query("ROLLBACK");

    // Clean up any uploaded files on error
    if (req.files) {
      // req.files is an object where values are arrays of files
      for (const key in req.files) {
        req.files[key].forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
    }

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getOurAchievements = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM our_achievements");
  const section_title = rows[0]?.section_title || "";
  res.json({ section_title, items: rows.slice(0, 3) });
};

export const updateOurAchievements = async (req, res) => {
  const { section_title = "", items = [] } = req.body;
  await db.query("DELETE FROM our_achievements");
  for (const item of items.slice(0, 3)) {
    await db.query(
      "INSERT INTO our_achievements (number, text, section_title) VALUES (?, ?, ?)",
      [item.number, item.text, section_title]
    );
  }
  res.json({ success: true });
};

export const getOurAdServices = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM our_ad_services");
  const section_title = rows[0]?.section_title || "";
  res.json({ section_title, items: rows });
};

export const updateOurAdServices = async (req, res) => {
  const { section_title = "", items = [] } = req.body;
  await db.query("DELETE FROM our_ad_services");
  for (const item of items) {
    await db.query(
      "INSERT INTO our_ad_services (title, description, section_title) VALUES (?, ?, ?)",
      [item.title, item.description, section_title]
    );
  }
  res.json({ success: true });
};