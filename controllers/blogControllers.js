import db from "../Utils/db.js";

export const creataBlogPost = async (req, res) => {
  try {
    const {
      title,
      author,
      blogType,
      content,
      tags, // JSON stringified from frontend
    } = req.body;

    const images = [];

    req.files.forEach((file, index) => {
      images.push({
        filePath: `/uploads/${file.filename}`,
        show: req.body[`images[${index}][show]`] === "true",
        order: parseInt(req.body[`images[${index}][order]`]),
      });
    });

    const sql = `INSERT INTO blogs (title, author, blog_type, content, tags, images)
                   VALUES (?, ?, ?, ?, ?, ?)`;

    await db.query(sql, [
      title,
      author,
      blogType,
      content,
      tags,
      JSON.stringify(images),
    ]);

    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating blog post" });
  }
};

export const updateBlogPost = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, author, blogType, content, tags } = req.body;

    // Parse tags safely (it may come as stringified array)
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    const images = [];

    for (let i = 0; i < 4; i++) {
      const fileField = `images[${i}][file]`;
      const existingUrlField = `images[${i}][existingUrl]`; // optional if you're sending existing image path
      const showField = `images[${i}][show]`;
      const orderField = `images[${i}][order]`;

      const file = req.files.find((f) => f.fieldname === fileField);
      const filePath = file
        ? `/uploads/${file.filename}`
        : req.body[existingUrlField] || ""; // fallback to existing image if not replaced

      const show =
        req.body[showField] === "true" || req.body[showField] === true;
      const order = parseInt(req.body[orderField]);

      if (filePath) {
        images.push({
          filePath,
          show,
          order,
        });
      }
    }

    const updateSql = `
      UPDATE blogs
      SET title = ?, author = ?, blog_type = ?, content = ?, tags = ?, images = ?
      WHERE id = ?
    `;

    await db.query(updateSql, [
      title,
      author,
      blogType,
      content,
      JSON.stringify(parsedTags),
      JSON.stringify(images),
      blogId,
    ]);

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ message: "Error updating blog post" });
  }
};

export const getAllBlogPsot = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );
    res.status(200).json({ success: true, blogs: rows });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: err.message,
    });
  }
};

export const specificBlog = async (req, res) => {
  const { id } = req.params; // Get the blog ID from the request params

  try {
    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog: rows[0] });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: err.message,
    });
  }
};
