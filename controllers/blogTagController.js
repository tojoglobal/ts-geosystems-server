import db from "../Utils/db.js";

export const getAllTags = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tags ORDER BY name ASC");
    res.status(200).json({ success: true, tags: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch tags" });
  }
};

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    await db.query("INSERT INTO tags (name) VALUES (?)", [name]);
    res.status(201).json({ success: true, message: "Tag created" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add tag" });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Optionally: check if tag exists, etc.

    await db.query("UPDATE tags SET name = ? WHERE id = ?", [name, id]);
    res.status(200).json({ success: true, message: "Tag updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update tag" });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM tags WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Tag deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete tag" });
  }
};
