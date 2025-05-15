import db from "../Utils/db.js";
import { deleteFileFromUploads } from "../Utils/deleteFileFromUploads.js";

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

// export const updateBlogPost = async (req, res) => {
//   try {
//     const blogId = req.params.id;
//     const { title, author, blogType, content, tags, images } = req.body;
//     console.log("Request Body:", req.body);
//     // console.log("Request Files:", req.files);
//     const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

//     // Fetch current blog data from DB to preserve untouched images
//     const [rows] = await db.query("SELECT images FROM blogs WHERE id = ?", [
//       blogId,
//     ]);
//     const existingImages = JSON.parse(rows[0]?.images || "[]");

//     // console.log(images);

//     const updatedImages = [...existingImages];
//     console.log(updatedImages);

//     for (let i = 0; i < 4; i++) {
//       const fileField = `images[${i}][file]`;
//       const existingUrlField = `images[${i}][existingUrl]`;
//       const showField = `images[${i}][show]`;
//       const orderField = `images[${i}][order]`;

//       console.log(fileField, existingUrlField, showField, orderField);

//       if (
//         req.body[showField] !== undefined ||
//         req.body[orderField] !== undefined ||
//         req.body[existingUrlField] ||
//         req.files.find((f) => f.fieldname === fileField)
//       ) {
//         const file = req.files.find((f) => f.fieldname === fileField);
//         const filePath = file
//           ? `/uploads/${file.filename}`
//           : req.body[existingUrlField] || existingImages[i]?.filePath || "";

//         const show =
//           req.body[showField] === "true" || req.body[showField] === true;
//         const order =
//           parseInt(req.body[orderField]) || existingImages[i]?.order || i + 1;

//         updatedImages[i] = {
//           filePath,
//           show,
//           order,
//         };
//       }
//     }

//     const updateSql = `
//       UPDATE blogs
//       SET title = ?, author = ?, blog_type = ?, content = ?, tags = ?, images = ?
//       WHERE id = ?
//     `;

//     await db.query(updateSql, [
//       title,
//       author,
//       blogType,
//       content,
//       JSON.stringify(parsedTags),
//       JSON.stringify(updatedImages),
//       blogId,
//     ]);

//     res.status(200).json({ message: "Blog updated successfully" });
//   } catch (error) {
//     console.error("Error updating blog post:", error);
//     res.status(500).json({ message: "Error updating blog post" });
//   }
// };

export const updateBlogPost = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, author, blogType, content, tags, images } = req.body;

    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    const parsedImages =
      typeof images === "string" ? JSON.parse(images) : images;

    const [rows] = await db.query("SELECT images FROM blogs WHERE id = ?", [
      blogId,
    ]);
    const existingImages = JSON.parse(rows[0]?.images || "[]");

    const updatedImages = [...existingImages];

    for (let i = 0; i < 4; i++) {
      const img = parsedImages[i];
      const file = req.files.find((f) => f.fieldname === `images[${i}][file]`);

      let filePath = existingImages[i]?.filePath || "";

      if (file) {
        // Delete old image if it exists
        if (existingImages[i]?.filePath) {
          const oldImagePath = path.join("public", existingImages[i].filePath);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Save new file path
        filePath = `/uploads/${file.filename}`;
      } else if (img?.previewUrl) {
        filePath = img.previewUrl;
      }

      const show = img?.show === "true" || img?.show === true;
      const order = parseInt(img?.order) || 0;

      updatedImages[i] = {
        filePath,
        show,
        order,
      };
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
      JSON.stringify(updatedImages),
      blogId,
    ]);

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error("Error updating blog post:", error);
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

export const deleteBlogPost = async (req, res) => {
  const blogId = req.params.id;

  try {
    // Step 1: Get blog image paths from DB
    const [rows] = await db.query("SELECT images FROM blogs WHERE id = ?", [
      blogId,
    ]);

    if (!rows.length) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const blog = rows[0];
    const images =
      typeof blog.images === "string" ? JSON.parse(blog.images) : [];

    // Step 2: Delete each image safely from uploads folder
    // console.log("Image", images);

    images.forEach((img) => {
      if (img && img?.filePath) {
        deleteFileFromUploads(img.filePath);
      }
    });

    // Step 3: Delete blog post from DB
    await db.query("DELETE FROM blogs WHERE id = ?", [blogId]);

    res.status(200).json({ message: "Blog and images deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

// for details page related blog
export const getRelatedBlogs = async (req, res) => {
  try {
    const { type, excludeId } = req.query;
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Blog type is required",
      });
    }

    // Get 3 related blogs of the same type, excluding the current one
    const [rows] = await db.query(
      "SELECT id, title, images, created_at FROM blogs WHERE blog_type = ? AND id != ? ORDER BY created_at DESC LIMIT 3",
      [type, excludeId]
    );

    // Process the data to match what your frontend expects
    const relatedArticles = rows.map((blog) => {
      const images =
        typeof blog.images === "string" ? JSON.parse(blog.images) : blog.images;
      const firstImage = images.find((img) => img?.show)?.filePath || "";

      return {
        id: blog.id,
        title: blog.title,
        image: firstImage
          ? `${process.env.VITE_OPEN_APIURL || ""}${firstImage}`
          : "",
        readTime: "5 minute read",
        date: new Date(blog.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
    });

    res.status(200).json({
      success: true,
      relatedArticles,
    });
  } catch (err) {
    console.error("Error in getRelatedBlogs:", err); // Detailed error logging
    res.status(500).json({
      success: false,
      message: "Failed to fetch related blogs",
      error: err.message,
    });
  }
};
