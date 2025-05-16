import db from "../Utils/db.js";

// Save trade-in form data and uploaded files
export const saveTradeInData = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      equipment,
      model,
      serialNumber,
      software,
      manufactureDate,
      condition,
      sellOrTrade,
      comments,
    } = req.body;

    // Defensive: prevent error if no files
    const photos = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const sql = `
  INSERT INTO trade_in_submissions
  (name, company, email, phone, equipment, model, serialNumber, software, manufactureDate, \`condition\`, sellOrTrade, comments, photos)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
      name,
      company,
      email,
      phone,
      equipment,
      model,
      serialNumber,
      software,
      manufactureDate,
      condition,
      sellOrTrade,
      comments,
      JSON.stringify(photos),
    ];

    await db.query(sql, values);

    res.status(201).json({ message: "Trade-in form submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving trade-in data." });
  }
};

// Get all trade-in submissions
export const getTradeInData = async (req, res) => {
  try {
    const sql = "SELECT * FROM trade_in_submissions";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trade-in data." });
  }
};
