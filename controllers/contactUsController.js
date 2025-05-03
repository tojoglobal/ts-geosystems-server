import db from "../Utils/db.js";

// GET admin contact info (formatted for frontend)
export const getContactUs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM contact_us LIMIT 1");
    const data = rows[0];

    if (!data) {
      return res.json({
        phoneNumbers: [],
        emails: [],
        officeAddresses: [],
      });
    }

    const formatArray = (jsonStr) => {
      try {
        const arr = JSON.parse(jsonStr || "[]");
        return Array.isArray(arr) ? arr.map((v) => ({ value: v })) : [];
      } catch {
        return [];
      }
    };

    const response = {
      phoneNumbers: formatArray(data.phoneNumbers),
      emails: formatArray(data.emails),
      officeAddresses: formatArray(data.officeAddresses),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching admin contact info:", error);
    res.status(500).json({ error: error.message });
  }
};

// PUT update public admin contact info
export const updateContactUs = async (req, res) => {
  try {
    const { phoneNumbers, emails, officeAddresses } = req.body;

    // Input validation
    if (
      !Array.isArray(phoneNumbers) ||
      !Array.isArray(emails) ||
      !Array.isArray(officeAddresses)
    ) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Prepare data for JSON storage
    const contactData = {
      phoneNumbers: phoneNumbers.map((p) => p.value),
      emails: emails.map((e) => e.value),
      officeAddresses: officeAddresses.map((a) => a.value),
    };

    // Upsert operation
    await db.query(
      `
      INSERT INTO contact_us (id, phoneNumbers, emails, officeAddresses) 
      VALUES (1, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        phoneNumbers = VALUES(phoneNumbers),
        emails = VALUES(emails),
        officeAddresses = VALUES(officeAddresses)
    `,
      [
        JSON.stringify(contactData.phoneNumbers),
        JSON.stringify(contactData.emails),
        JSON.stringify(contactData.officeAddresses),
      ]
    );

    res.json({ success: true, message: "Contact info updated" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Database update failed" });
  }
};
