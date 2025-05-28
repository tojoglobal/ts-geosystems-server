import db from "../Utils/db.js";

export const getUsedEquipmentContent = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM used_equipment_content LIMIT 1"
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No content found" });
    let links = null;
    if (rows[0].links) {
      try {
        links =
          typeof rows[0].links === "string"
            ? JSON.parse(rows[0].links)
            : rows[0].links;
      } catch {
        links = null;
      }
    }
    const {
      banner_image,
      banner_image_show,
      description,
      benefits_box_title,
      benefits_box_description,
      benefits_box_show,
    } = rows[0];
    res.status(200).json({
      success: true,
      data: {
        banner_image,
        banner_image_show: !!banner_image_show,
        description,
        benefits_box_title,
        benefits_box_description,
        benefits_box_show: !!benefits_box_show,
        links,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUsedEquipmentContent = async (req, res) => {
  try {
    let {
      description,
      banner_image_show,
      benefits_box_title,
      benefits_box_description,
      benefits_box_show,
      links,
      banner_image: incomingBannerImage, // get from form-data if present
    } = req.body;

    // Parse booleans
    banner_image_show =
      banner_image_show === "true" || banner_image_show === true;
    benefits_box_show =
      benefits_box_show === "true" || benefits_box_show === true;

    // Parse links if string
    if (typeof links === "string") {
      try {
        links = JSON.parse(links);
      } catch {
        links = null;
      }
    }

    // Get the current DB value for banner_image if no new file is uploaded and no value is provided
    let banner_image = incomingBannerImage;
    if (req.file) {
      banner_image = `/uploads/${req.file.filename}`;
    } else if (!banner_image) {
      // fallback: load the existing value from the DB
      const [existing] = await db.query(
        "SELECT banner_image FROM used_equipment_content LIMIT 1"
      );
      banner_image = existing.length > 0 ? existing[0].banner_image : "";
    }

    const linksString = links ? JSON.stringify(links) : null;

    // Upsert logic
    const [existing] = await db.query(
      "SELECT id FROM used_equipment_content LIMIT 1"
    );
    const values = [
      banner_image,
      banner_image_show,
      description,
      benefits_box_title,
      benefits_box_description,
      benefits_box_show,
      linksString,
    ];
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO used_equipment_content 
        (banner_image, banner_image_show, description, benefits_box_title, benefits_box_description, benefits_box_show, links)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        values
      );
    } else {
      await db.query(
        `UPDATE used_equipment_content SET 
          banner_image = ?, 
          banner_image_show = ?,
          description = ?,
          benefits_box_title = ?,
          benefits_box_description = ?,
          benefits_box_show = ?,
          links = ?
        WHERE id = ?`,
        [...values, existing[0].id]
      );
    }
    res.json({ success: true, message: "Used Equipment content updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
