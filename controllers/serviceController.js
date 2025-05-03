import db from "../Utils/db.js";

// Get service content (always returns one record)
export const getServiceContent = async (req, res) => {
  try {
    const [services] = await db.query("SELECT * FROM services LIMIT 1");

    if (services.length === 0) {
      // Initialize with default content if empty
      return res.json({
        title: "Surveying Equipment Service",
        description: "Default service description...",
        image1: "default-image1.jpg",
        image2: "default-image2.jpg",
      });
    }

    res.json(services[0]);
  } catch (error) {
    console.error("Error fetching service content:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update service content (upsert operation)
export const updateServiceContent = async (req, res) => {
  try {
    const { title, description, image1, image2 } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        error: "Title and description are required",
      });
    }

    // Upsert query (insert or update)
    const [result] = await db.query(
      `
      INSERT INTO services (id, title, description, image1, image2)
      VALUES (1, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      description = VALUES(description),
      image1 = VALUES(image1),
      image2 = VALUES(image2)
    `,
      [title, description, image1, image2]
    );

    res.json({
      success: true,
      message: "Service content updated successfully",
    });
  } catch (error) {
    console.error("Error updating service content:", error);
    res.status(500).json({ error: error.message });
  }
};
