import db from "../../Utils/db.js";
import fs from "fs";
import path from "path";

export const getWeProvide = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM we_provide ORDER BY id ASC LIMIT 3"
    );

    const result = [];
    for (let i = 0; i < 3; i++) {
      const item = rows[i] || {
        id: i + 1,
        title: "",
        image: "",
        description: JSON.stringify([]),
      };

      // Parse JSON description if it exists
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

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateWeProvide = async (req, res) => {
  try {
    const items = JSON.parse(req.body.items);
    const files = req.files || [];

    // Validate input data
    for (const item of items) {
      if (!item.description) {
        throw new Error("Description is required");
      }

      // Convert description to JSON array if it's not already
      if (!Array.isArray(item.description)) {
        item.description = [item.description];
      }
    }

    await db.query("START TRANSACTION");

    // Get current items first to preserve existing images
    const [currentItems] = await db.query(
      "SELECT * FROM we_provide ORDER BY id ASC LIMIT 3"
    );

    await db.query("DELETE FROM we_provide");

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let imageUrl = item.image; // Start with the submitted image URL

      // If no new image was uploaded and we have a current item, use its image
      if (!files[i] && currentItems[i] && currentItems[i].image) {
        imageUrl = currentItems[i].image;
      }
      // Fallback to default image if no image is available
      else if (!imageUrl) {
        imageUrl = "/uploads/we-provide/default-we-provide.jpg";
      }

      // Handle file upload if a new image was provided
      if (files[i]) {
        const file = files[i];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const newFilename = `we-provide-${Date.now()}-${i}${fileExtension}`;
        const newPath = path.join("uploads", "we-provide", newFilename);

        if (!fs.existsSync(path.join("uploads", "we-provide"))) {
          fs.mkdirSync(path.join("uploads", "we-provide"), { recursive: true });
        }

        fs.renameSync(file.path, newPath);
        imageUrl = `/uploads/we-provide/${newFilename}`;

        // Delete old image if it exists and isn't a default image
        if (
          currentItems[i]?.image &&
          !currentItems[i].image.includes("default-we-provide") &&
          fs.existsSync(path.join("public", currentItems[i].image))
        ) {
          fs.unlinkSync(path.join("public", currentItems[i].image));
        }
      }

      // Stringify the description array
      const descriptionJson = JSON.stringify(item.description);

      await db.query(
        "INSERT INTO we_provide (title, image, description) VALUES (?, ?, ?)",
        [item.title || "", imageUrl, descriptionJson]
      );
    }

    await db.query("COMMIT");
    res.json({ success: true, message: "We Provide updated successfully" });
  } catch (error) {
    await db.query("ROLLBACK");

    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getOurAchievements = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM our_achievements");
  res.json(rows.slice(0, 3)); // Always return top 3
};

export const updateOurAchievements = async (req, res) => {
  const items = req.body.slice(0, 3);
  await db.query("DELETE FROM our_achievements");
  for (const item of items) {
    await db.query(
      "INSERT INTO our_achievements (number, text) VALUES (?, ?)",
      [item.number, item.text]
    );
  }
  res.json({ success: true });
};

export const getOurAdServices = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM our_ad_services");
  res.json(rows);
};

export const updateOurAdServices = async (req, res) => {
  const items = req.body;
  await db.query("DELETE FROM our_ad_services");
  for (const item of items) {
    await db.query(
      "INSERT INTO our_ad_services (title, description) VALUES (?, ?)",
      [item.title, item.description]
    );
  }
  res.json({ success: true });
};
