import db from "../Utils/db.js";

// Save support form data
export const saveSupportRequest = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      equipment,
      model,
      supportIssues,
      details,
    } = req.body;

    // Process uploaded files
    const uploadedFiles = req.files.map((file) => `/uploads/${file.filename}`);

    const sql = `
      INSERT INTO support_requests
      (name, company, email, phone, equipment, model, supportIssues, details, files)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      company,
      email,
      phone,
      equipment,
      model,
      JSON.stringify(supportIssues), // Convert array to JSON string
      details,
      JSON.stringify(uploadedFiles), // Save file paths as JSON string
    ];

    await db.query(sql, values);

    res
      .status(201)
      .json({ message: "Support request submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving support request." });
  }
};

// Retrieve all support requests
export const getSupportRequests = async (req, res) => {
  try {
    const sql = "SELECT * FROM support_requests";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching support requests." });
  }
};

// support dynamic Instrument Type *
// Get support content
export const getSupportContent = async (req, res) => {
  try {
    const [content] = await db.query("SELECT * FROM support_content LIMIT 1");
    if (content.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          instrument_types: [],
          description: "",
        },
      });
    }
    const supportContent = content[0];
    try {
      supportContent.instrument_types = JSON.parse(
        supportContent.instrument_types || "[]"
      );
    } catch (e) {
      supportContent.instrument_types = [];
    }
    res.status(200).json({
      success: true,
      data: supportContent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update support content
export const updateSupportContent = async (req, res) => {
  try {
    const { instrument_types, description } = req.body;
    const supportData = {
      instrument_types: JSON.stringify(instrument_types || []),
      description: description || "",
    };
    const [existing] = await db.query("SELECT id FROM support_content LIMIT 1");
    if (existing.length === 0) {
      await db.query("INSERT INTO support_content SET ?", supportData);
    } else {
      await db.query("UPDATE support_content SET ? WHERE id = ?", [
        supportData,
        existing[0].id,
      ]);
    }
    res.json({
      success: true,
      message: "Support content updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
