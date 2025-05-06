import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

export const getAboutUs = async (req, res) => {
  try {
    const [aboutContent] = await db.query("SELECT * FROM about_us LIMIT 1");

    if (aboutContent.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          section1_title: "Snapshot",
          section1_description: "",
          section2_title: "What We Do",
          section2_points: [],
          section3_title: "Who We Serve",
          section3_description: "",
          section4_title: "Our Promise",
          section4_description: "",
          section5_title: "Our Services",
          section5_description: "",
          section6_title: "Our Journey",
          section6_description: "",
          section7_title: "Our Future",
          section7_description: "",
          section8_title: "Why Choose Us?",
          section8_description: "",
          section9_title: "Connect With Us",
          section9_description: "",
          who_we_serve_image: null,
          bottom_section_image: null,
        },
      });
    }

    const content = aboutContent[0];

    // Parse JSON points and clean HTML
    try {
      content.section2_points = JSON.parse(content.section2_points || "[]");
      if (typeof content.section2_points === "string") {
        content.section2_points = JSON.parse(content.section2_points);
      }
    } catch (e) {
      content.section2_points = [];
    }

    // Clean HTML descriptions
    const htmlFields = [
      "section1_description",
      "section3_description",
      "section4_description",
      "section5_description",
      "section6_description",
      "section7_description",
      "section8_description",
      "section9_description",
    ];

    htmlFields.forEach((field) => {
      if (content[field]) {
        content[field] = content[field]
          .replace(/\\u003C/g, "<")
          .replace(/\\u003E/g, ">")
          .replace(/\\u0026/g, "&")
          .replace(/\\"/g, '"');
      }
    });

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Error fetching about us content:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateAboutUs = async (req, res) => {
  try {
    const {
      section1_title,
      section1_description,
      section2_title,
      section2_points,
      section3_title,
      section3_description,
      section4_title,
      section4_description,
      section5_title,
      section5_description,
      section6_title,
      section6_description,
      section7_title,
      section7_description,
      section8_title,
      section8_description,
      section9_title,
      section9_description,
    } = req.body;
    
    let who_we_serve_image = req.body.old_who_we_serve_image || null;
    let bottom_section_image = req.body.old_bottom_section_image || null;

    // Handle file uploads
   if (req.files) {
     if (req.files.who_we_serve_image) {
       const file = req.files.who_we_serve_image[0];
       const fileExtension = path.extname(file.originalname).toLowerCase();
       const newFilename = `who-we-serve-${Date.now()}${fileExtension}`;
       const newPath = path.join("uploads", "about-us", newFilename);

       fs.renameSync(file.path, newPath);
       who_we_serve_image = `/uploads/about-us/${newFilename}`;

       // Delete old image if it exists
       if (
         req.body.old_who_we_serve_image &&
         fs.existsSync(path.join("public", req.body.old_who_we_serve_image))
       ) {
         fs.unlinkSync(path.join("public", req.body.old_who_we_serve_image));
       }
     }

     if (req.files.bottom_section_image) {
       const file = req.files.bottom_section_image[0];
       const fileExtension = path.extname(file.originalname).toLowerCase();
       const newFilename = `bottom-section-${Date.now()}${fileExtension}`;
       const newPath = path.join("uploads", "about-us", newFilename);

       fs.renameSync(file.path, newPath);
       bottom_section_image = `/uploads/about-us/${newFilename}`;

       // Delete old image if it exists
       if (
         req.body.old_bottom_section_image &&
         fs.existsSync(path.join("public", req.body.old_bottom_section_image))
       ) {
         fs.unlinkSync(path.join("public", req.body.old_bottom_section_image));
       }
     }
   }

    const aboutData = {
      section1_title,
      section1_description,
      section2_title,
      section2_points: JSON.stringify(section2_points || []),
      section3_title,
      section3_description,
      section4_title,
      section4_description,
      section5_title,
      section5_description,
      section6_title,
      section6_description,
      section7_title,
      section7_description,
      section8_title,
      section8_description,
      section9_title,
      section9_description,
      who_we_serve_image,
      bottom_section_image,
    };

    const [existing] = await db.query("SELECT id FROM about_us LIMIT 1");

    if (existing.length === 0) {
      await db.query("INSERT INTO about_us SET ?", aboutData);
    } else {
      await db.query("UPDATE about_us SET ? WHERE id = ?", [
        aboutData,
        existing[0].id,
      ]);
    }

    res.json({
      success: true,
      message: "About Us content updated successfully",
    });
  } catch (error) {
    console.error("Error updating about us content:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
