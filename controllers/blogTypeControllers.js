import db from "../Utils/db.js";

export const getAllBlogTypes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM blog_types ORDER BY id DESC");
    res.status(200).json({ message: "Fetched blog types", blogTypes: rows });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog types" });
  }
};

export const createNewBlogType = async (req, res) => {
  try {
    const { name, status = 1 } = req.body;
    await db.query("INSERT INTO blog_types (name, status) VALUES (?, ?)", [
      name,
      status,
    ]);
    res.status(201).json({ message: "Blog type created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Blog type creation failed" });
  }
};

export const updateBlogType = async (req, res) => {
  try {
    const { name, status = 1 } = req.body;
    const { id } = req.params;
    await db.query("UPDATE blog_types SET name = ?, status = ? WHERE id = ?", [
      name,
      status,
      id,
    ]);
    res.status(200).json({ message: "Blog type updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog type" });
  }
};

export const deleteBlogType = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM blog_types WHERE id = ?", [id]);
    res.status(200).json({ message: "Blog type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog type" });
  }
};
