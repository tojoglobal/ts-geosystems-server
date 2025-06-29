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

// trade in dynamic part here
export const getTradeInContent = async (req, res) => {
  try {
    const [content] = await db.query("SELECT * FROM trade_in_content LIMIT 1");

    if (content.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          title1: "",
          description1: "",
          title2: "",
          process_points: [],
          title3: "",
          description3: "",
          instrument_makes: [],
        },
      });
    }

    const tradeInContent = content[0];

    // Parse JSON arrays
    try {
      tradeInContent.process_points = JSON.parse(
        tradeInContent.process_points || "[]"
      );
      tradeInContent.instrument_makes = JSON.parse(
        tradeInContent.instrument_makes || "[]"
      );
    } catch (e) {
      tradeInContent.process_points = [];
      tradeInContent.instrument_makes = [];
    }

    res.status(200).json({
      success: true,
      data: tradeInContent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTradeInContent = async (req, res) => {
  try {
    const {
      title1,
      description1,
      title2,
      process_points,
      title3,
      description3,
      instrument_makes,
    } = req.body;

    const tradeInData = {
      title1,
      description1,
      title2,
      process_points: JSON.stringify(process_points || []),
      title3,
      description3,
      instrument_makes: JSON.stringify(instrument_makes || []),
    };

    const [existing] = await db.query(
      "SELECT id FROM trade_in_content LIMIT 1"
    );

    if (existing.length === 0) {
      await db.query("INSERT INTO trade_in_content SET ?", tradeInData);
    } else {
      await db.query("UPDATE trade_in_content SET ? WHERE id = ?", [
        tradeInData,
        existing[0].id,
      ]);
    }

    res.json({
      success: true,
      message: "Trade-In content updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteTradeInData = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "DELETE FROM trade_in_submissions WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Trade-In request not found." });
    }
    res.status(200).json({ message: "Trade-In request deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trade-in request." });
  }
};