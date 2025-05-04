import db from "../Utils/db.js";

export const getHire = async (req, res) => {
  try {
    const [services] = await db.query("SELECT * FROM hire LIMIT 1");
    if (services.length === 0) {
      return res.status(404).json({ message: "Hire content not found" });
    }
    res.json(services[0]);
  } catch (error) {
    console.error("Error fetching service content:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateHire = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // Check if any record exists
    const [existing] = await db.query("SELECT id FROM hire LIMIT 1");

    if (existing.length === 0) {
      // If no record exists, insert new record
      await db.query("INSERT INTO hire (title, description) VALUES (?, ?)", [
        title,
        description,
      ]);
    } else {
      // If record exists, update it
      await db.query(
        "UPDATE hire SET title = ?, description = ? WHERE id = ?",
        [title, description, existing[0].id]
      );
    }

    res.json({ message: "Hire content updated successfully" });
  } catch (error) {
    console.error("Error updating hire content:", error);
    res.status(500).json({ error: error.message });
  }
};
