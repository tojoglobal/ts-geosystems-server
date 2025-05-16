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
