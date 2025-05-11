import db from "../Utils/db.js";

export const getAllAuthor = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM authors ORDER BY id DESC");
    res.status(201).json({ message: "Author created", author: rows });
  } catch (error) {
    res.status(500).json({ message: "Author not created" });
  }
};

export const createNewAuthor = async (req, res) => {
  try {
    const { name, status = 1 } = req.body;
    await db.query("INSERT INTO authors (name, status) VALUES (?, ?)", [
      name,
      status,
    ]);
    res.status(201).json({ message: "Author created Done" });
  } catch (error) {
    res.status(500).json({ message: "Author didn't created" });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const { name, status } = req.body;
    const { id } = req.params;
    await db.query("UPDATE authors SET name = ?, status = ? WHERE id = ?", [
      name,
      status,
      id,
    ]);
    res.status(200).json({ message: "Author updated done" });
  } catch (error) {
    res.status(500).json({ message: "Author not updated" });
  }
};

export const deteteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM authors WHERE id = ?", [id]);
    res.json({ message: "Author deleted Done" });
  } catch (error) {
    res.status(500).json({ message: "Author not deleted" });
  }
};
