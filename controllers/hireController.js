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

    const { title, description, infoBox, imageUrl, show_buttons } =
      hireContent[0];
    res.status(200).json({
      success: true,
      data: { title, description, infoBox, imageUrl, links, show_buttons },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHire = async (req, res) => {
  try {
    const { title, description, infoBox, show_buttons } = req.body;
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
        "INSERT INTO hire (title, description, infoBox, imageUrl, links, show_buttons) VALUES (?, ?, ?, ?, ?, ?)",
        [
          title,
          description,
          infoBox,
          imageUrl,
          linksString,
          show_buttons === "true",
        ]
      );
    } else {
      await db.query(
        "UPDATE hire SET title = ?, description = ?, infoBox = ?, imageUrl = ?, links = ?, show_buttons = ? WHERE id = ?",
        [
          title,
          description,
          infoBox,
          imageUrl,
          linksString,
          show_buttons === "true",
          existing[0].id,
        ]
      );
    }

    res.json({
      success: true,
      message: "Hire content updated successfully",
      imageUrl,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// front end data recive this contollers

// Save hire enquiry
export const saveHireEnquiry = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      existingCustomer,
      equipment,
      hireDate,
      hirePeriod,
      comments,
    } = req.body;

    const sql = `
      INSERT INTO hire_enquiries
      (name, company, email, phone, existingCustomer, equipment, hireDate, hirePeriod, comments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      company,
      email,
      phone,
      existingCustomer,
      JSON.stringify(equipment), // Save equipment as JSON array
      hireDate,
      hirePeriod,
      comments,
    ];

    await db.query(sql, values);

    res.status(201).json({ message: "Hire enquiry submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving hire enquiry." });
  }
};

// Get hire content
export const getHireContent = async (req, res) => {
  try {
    const sql = "SELECT * FROM hire_enquiries";
    const [rows] = await db.query(sql);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Hire content not found." });
    }

    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: "Error fetching hire content." });
  }
};

// Normalized boolean output from SQL
export const getHireEquipment = async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, name, image_url, is_visible FROM equipment"
  );

  const formatted = rows.map((row) => ({
    ...row,
    is_visible: Boolean(row.is_visible),
  }));

  res.json(formatted);
};

export const hireUpdateEquipment = async (req, res) => {
  try {
    const { name, is_visible } = req.body;
    const { id } = req.params;
    let image_url = req.body.image_url;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    await db.query(
      "UPDATE equipment SET name = ?, image_url = ?, is_visible = ? WHERE id = ?",
      [name, image_url, is_visible === "true", id]
    );

    res
      .status(201)
      .json({ success: true, message: `Equipment ${name} updated` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
