import db from "../Utils/db.js";

// Get homepage component states
export const getHomepageControl = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM homepage_control LIMIT 1");
    
    if (result.length > 0) {
      res.json({
        success: true,
        components: JSON.parse(result[0].components)
      });
    } else {
      res.json({
        success: false,
        message: "No homepage control settings found"
      });
    }
  } catch (error) {
    console.error("Error in getHomepageControl:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Update homepage component states
export const updateHomepageControl = async (req, res) => {
  try {
    const { components } = req.body;
    
    // Check if record exists
    const [existing] = await db.query("SELECT id FROM homepage_control LIMIT 1");
    
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
      message: "Homepage control settings updated successfully"
    });
  } catch (error) {
    console.error("Error in updateHomepageControl:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};