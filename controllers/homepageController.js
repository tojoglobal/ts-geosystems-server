import db from "../Utils/db.js";

// Get homepage component states
export const getHomepageControl = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM homepage_control LIMIT 1");

    if (result.length > 0) {
      res.json({
        success: true,
        components: JSON.parse(result[0].components),
      });
    } else {
      res.json({
        success: false,
        message: "No homepage control settings found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update homepage component states
export const updateHomepageControl = async (req, res) => {
  try {
    const { components } = req.body;

    // Check if record exists
    const [existing] = await db.query(
      "SELECT id FROM homepage_control LIMIT 1"
    );

    if (existing.length > 0) {
      // Update existing record
      await db.query(
        "UPDATE homepage_control SET components = ?, updated_at = NOW() WHERE id = ?",
        [JSON.stringify(components), existing[0].id]
      );
    } else {
      // Create new record
      await db.query(
        "INSERT INTO homepage_control (components, created_at, updated_at) VALUES (?, NOW(), NOW())",
        [JSON.stringify(components)]
      );
    }

    res.json({
      success: true,
      message: "Homepage control settings updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// for footer join subscriber part
// Add new subscriber
export const addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if email already exists
    const [existing] = await db.query(
      "SELECT * FROM email_subscribers WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already subscribed" });
    }

    // Insert new subscriber
    await db.query("INSERT INTO email_subscribers (email) VALUES (?)", [email]);

    res.status(201).json({ message: "Subscription successful" });
  } catch (err) {
    console.error("Error adding subscriber:", err);
    res.status(500).json({ error: "Failed to add subscriber" });
  }
};

// Get all subscribers
export const getAllSubscribers = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM email_subscribers"
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated subscribers
    const [subscribers] = await db.query(
      "SELECT * FROM email_subscribers ORDER BY subscribed_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.status(200).json({
      success: true,
      data: subscribers,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching subscribers:", err);
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
};

// Delete subscriber
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM email_subscribers WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    res.status(200).json({ message: "Subscriber deleted successfully" });
  } catch (err) {
    console.error("Error deleting subscriber:", err);
    res.status(500).json({ error: "Failed to delete subscriber" });
  }
};
