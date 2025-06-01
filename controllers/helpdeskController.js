import db from "../Utils/db.js";

export const getHelpdeskInfo = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM helpdesk_info LIMIT 1");
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateHelpdeskInfo = async (req, res) => {
  try {
    const {
      title,
      helpline_number,
      whatsapp,
      email,
      contact_btn_label,
      contact_btn_link,
      tooltip_text,
    } = req.body;

    const [existing] = await db.query("SELECT id FROM helpdesk_info LIMIT 1");
    if (!existing.length) {
      await db.query(
        `INSERT INTO helpdesk_info (title, helpline_number, whatsapp, email, contact_btn_label, contact_btn_link, tooltip_text)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          helpline_number,
          whatsapp,
          email,
          contact_btn_label,
          contact_btn_link,
          tooltip_text,
        ]
      );
    } else {
      await db.query(
        `UPDATE helpdesk_info SET title = ?, helpline_number = ?, whatsapp = ?, email = ?, contact_btn_label = ?, contact_btn_link = ?, tooltip_text = ? WHERE id = ?`,
        [
          title,
          helpline_number,
          whatsapp,
          email,
          contact_btn_label,
          contact_btn_link,
          tooltip_text,
          existing[0].id,
        ]
      );
    }

    res.json({ success: true, message: "Helpdesk info updated successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
