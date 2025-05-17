import db from "../Utils/db.js";
import fs from "fs";
import path from "path";
import { deleteFileFromUploads } from "./../Utils/deleteFileFromUploads.js";

export const getService = async (req, res) => {
  try {
    const [serviceContent] = await db.query("SELECT * FROM service LIMIT 1");

    if (serviceContent.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service content not found",
      });
    }

    const { title, description, info_after_images, image_grid, image_banner } =
      serviceContent[0];
    res.status(200).json({
      success: true,
      data: { title, description, info_after_images, image_grid, image_banner },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const {
      title,
      description,
      info_after_images,
      oldImageGrid,
      oldImageBanner,
    } = req.body;

    let image_grid = oldImageGrid;
    let image_banner = oldImageBanner;

    // Handle grid image upload
    if (req.files["imageGrid"]?.[0]) {
      const gridFile = req.files["imageGrid"][0];
      const gridExtension = path.extname(gridFile.originalname).toLowerCase();
      const gridFilename = `service-grid-${Date.now()}${gridExtension}`;
      const gridPath = path.join("uploads", "service", gridFilename);

      fs.renameSync(gridFile.path, gridPath);
      image_grid = `/uploads/service/${gridFilename}`;

      // Clean up old grid image if it exists
      if (oldImageGrid && fs.existsSync(path.join("public", oldImageGrid))) {
        fs.unlinkSync(path.join("public", oldImageGrid));
      }
    }

    // Handle banner image upload
    if (req.files["imageBanner"]?.[0]) {
      const bannerFile = req.files["imageBanner"][0];
      const bannerExtension = path
        .extname(bannerFile.originalname)
        .toLowerCase();
      const bannerFilename = `service-banner-${Date.now()}${bannerExtension}`;
      const bannerPath = path.join("uploads", "service", bannerFilename);

      fs.renameSync(bannerFile.path, bannerPath);
      image_banner = `/uploads/service/${bannerFilename}`;

      // Clean up old banner image if it exists
      if (
        oldImageBanner &&
        fs.existsSync(path.join("public", oldImageBanner))
      ) {
        fs.unlinkSync(path.join("public", oldImageBanner));
      }
    }

    if (!title || !description || !info_after_images) {
      return res.status(400).json({
        message: "Title, description and info after images are required",
      });
    }

    // Check if any record exists
    const [existing] = await db.query("SELECT id FROM service LIMIT 1");

    if (existing.length === 0) {
      // Insert new record
      await db.query(
        "INSERT INTO service (title, description, info_after_images, image_grid, image_banner) VALUES (?, ?, ?, ?, ?)",
        [title, description, info_after_images, image_grid, image_banner]
      );
    } else {
      // Update existing record
      await db.query(
        "UPDATE service SET title = ?, description = ?, info_after_images = ?, image_grid = ?, image_banner = ? WHERE id = ?",
        [
          title,
          description,
          info_after_images,
          image_grid,
          image_banner,
          existing[0].id,
        ]
      );
    }

    res.json({
      success: true,
      message: "Service content updated successfully",
      image_grid,
      image_banner,
    });
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (
      req.files["imageGrid"]?.[0] &&
      fs.existsSync(req.files["imageGrid"][0].path)
    ) {
      fs.unlinkSync(req.files["imageGrid"][0].path);
    }
    if (
      req.files["imageBanner"]?.[0] &&
      fs.existsSync(req.files["imageBanner"][0].path)
    ) {
      fs.unlinkSync(req.files["imageBanner"][0].path);
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateServiceImages = async (req, res) => {
  try {
    const [current] = await db.query(
      "SELECT images FROM services_image_controls WHERE id = 1"
    );
    const existingImages = JSON.parse(current[0]?.images || "[]");

    const updatedImages = [...existingImages];
    for (let i = 0; i < 6; i++) {
      const show = req.body[`show_${i}`] === "true";
      const order = parseInt(req.body[`order_${i}`] || 0);
      const section = req.body[`section_${i}`] || "";

      const file = req.files?.find((f) => f.fieldname === `images[${i}][file]`);

      const existing = existingImages[i];

      let filePath = existing?.filePath || "";
      console.log(filePath);

      if (file) {
        // Delete old image if it exists
        if (existing?.filePath) {
          deleteFileFromUploads(filePath);
        }
        filePath = `/uploads/${file.filename}`;
      } else {
        filePath = req.body[`filePath_${i}`] || filePath;
      }

      updatedImages[i] = {
        filePath,
        show,
        order,
        section,
      };
    }

    await db.query(
      "UPDATE services_image_controls SET images = ? WHERE id = 1",
      [JSON.stringify(updatedImages)]
    );

    res.status(200).json({ message: "service images updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to update service images." });
  }
};

export const getServiceImages = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT images FROM services_image_controls WHERE id = 1"
    );
    const images = JSON.parse(rows[0]?.images || "[]");
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
};
