import db from "../Utils/db.js";

// GET admin contact info
export const getContactUs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM contact_us LIMIT 1");
    const data = rows[0];

    if (!data) {
      return res.json({
        phoneNumbers: [],
        emails: [],
        officeAddresses: [],
        workingDays: "",
        weeklyHoliday: "",
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
      workingDays: data.working_days || "",
      weeklyHoliday: data.weekly_holiday || "",
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update public admin contact info
export const updateContactUs = async (req, res) => {
  try {
    const {
      phoneNumbers,
      emails,
      officeAddresses,
      socialLinks,
      workingDays,
      weeklyHoliday,
    } = req.body;

    // Input validation
    if (
      !Array.isArray(phoneNumbers) ||
      !Array.isArray(emails) ||
      !Array.isArray(officeAddresses) ||
      !workingDays ||
      !weeklyHoliday
    ) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Prepare data for JSON storage
    const contactData = {
      phoneNumbers: phoneNumbers.map((p) => p.value),
      emails: emails.map((e) => e.value),
      officeAddresses: officeAddresses.map((a) => a.value),
      socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
      working_days: workingDays,
      weekly_holiday: weeklyHoliday,
    };

    // Upsert operation
    await db.query(
      `
      INSERT INTO contact_us (id, phoneNumbers, emails, officeAddresses, socialLinks, working_days, weekly_holiday) 
      VALUES (1, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        phoneNumbers = VALUES(phoneNumbers),
        emails = VALUES(emails),
        officeAddresses = VALUES(officeAddresses),
        socialLinks = VALUES(socialLinks),
        working_days = VALUES(working_days),
        weekly_holiday = VALUES(weekly_holiday)
      `,
      [
        JSON.stringify(contactData.phoneNumbers),
        JSON.stringify(contactData.emails),
        JSON.stringify(contactData.officeAddresses),
        contactData.socialLinks,
        contactData.working_days,
        contactData.weekly_holiday,
      ]
    );

    res.json({ success: true, message: "Contact info updated" });
  } catch (error) {
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
        error: "Description is required",
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
      message: "Certificate description updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update certificate description",
    });
  }
};

// Submit contact form
export const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    // Basic validation
    if (!firstName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "First name, email, and message are required",
      });
    }

    const [result] = await db.query(
      "INSERT INTO contact_messages (first_name, last_name, email, phone, message) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, phone, message]
    );

    res.json({
      success: true,
      message: "Your message has been submitted successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to submit contact form",
    });
  }
};

// Get all contact messages
export const getContactMessages = async (req, res) => {
  try {
    const [messages] = await db.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch contact messages",
    });
  }
};

// Delete a contact message
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM contact_messages WHERE id = ?", [id]);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete contact message",
    });
  }
};
