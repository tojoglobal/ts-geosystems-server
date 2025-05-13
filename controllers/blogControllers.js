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

    const images = [];

    req.files.forEach((file, index) => {
      images.push({
        filePath: `/uploads/${file.filename}`,
        show: req.body[`images[${index}][show]`] === "true",
        order: parseInt(req.body[`images[${index}][order]`]),
      });
    });

    const sql = `UPDATE blogs
                     SET title = ?, author = ?, blog_type = ?, content = ?, tags = ?, images = ?
                     WHERE id = ?`;

    await db.query(sql, [
      title,
      author,
      blogType,
      content,
      tags,
      JSON.stringify(images),
      blogId,
    ]);

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating blog post" });
  }
};

export const getAllBlogPost = async (req, res) => {
  try {
    // Get parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;
    const blogType = req.query.type || null;

    // Base query and count
    let baseQuery = "SELECT * FROM blogs";
    let countQuery = "SELECT COUNT(*) as total FROM blogs";

    // Add WHERE clause if blogType is specified
    if (blogType && blogType !== "All") {
      baseQuery += " WHERE blog_type = ?";
      countQuery += " WHERE blog_type = ?";
    }

    // Add sorting and pagination
    baseQuery += " ORDER BY created_at DESC LIMIT ? OFFSET ?";

    // Get total count
    const countParams = blogType && blogType !== "All" ? [blogType] : [];
    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const queryParams =
      blogType && blogType !== "All"
        ? [blogType, limit, offset]
        : [limit, offset];
    const [rows] = await db.query(baseQuery, queryParams);

    res.status(200).json({
      success: true,
      blogs: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    });
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
