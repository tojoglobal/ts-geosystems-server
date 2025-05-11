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
      socialLinks: data.socialLinks ? JSON.parse(data.socialLinks) : null,
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
    const { phoneNumbers, emails, officeAddresses, socialLinks } = req.body;
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
      socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
    };

    // Upsert operation
    await db.query(
      `
      INSERT INTO contact_us (id, phoneNumbers, emails, officeAddresses, socialLinks) 
      VALUES (1, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        phoneNumbers = VALUES(phoneNumbers),
        emails = VALUES(emails),
        officeAddresses = VALUES(officeAddresses),
        socialLinks = VALUES(socialLinks)
      `,
      [
        JSON.stringify(contactData.phoneNumbers),
        JSON.stringify(contactData.emails),
        JSON.stringify(contactData.officeAddresses),
        contactData.socialLinks,
      ]
    );

    res.json({ success: true, message: "Contact info updated" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Database update failed" });
  }
};

// GET certificate description only
export const getCertificateDescription = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT certificate_description as description FROM contact_us LIMIT 1"
    );
    const description = rows[0]?.description || "";
    res.json({ success: true, description });
  } catch (error) {
    console.error("Error fetching certificate description:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch certificate description",
    });
  }
};

// PUT update certificate description
export const updateCertificateDescription = async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        error: "Description is required"
      });
    }

    // Ensure the record exists with all required fields
    await db.query(
      `
      INSERT INTO contact_us 
      (id, phoneNumbers, emails, officeAddresses, certificate_description) 
      VALUES (1, '[]', '[]', '[]', ?)
      ON DUPLICATE KEY UPDATE
        certificate_description = VALUES(certificate_description)
      `,
      [description]
    );

    res.json({ 
      success: true, 
      message: "Certificate description updated successfully" 
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to update certificate description" 
    });
  }
};