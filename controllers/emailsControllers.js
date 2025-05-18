import db from "../Utils/db.js";
import sendEmail from "../Utils/sendEmail.js";

export const getTheInboxMail = async (req, res) => {
  const { email } = req.params;
  console.log(email);

  const [rows] = await db.execute(
    "SELECT * FROM emails WHERE sender=? AND folder='inbox' ORDER BY created_at DESC",
    [email]
  );

  res.json(rows);
};

export const getTheStarredMail = async (req, res) => {
  const { email } = req.params;
  const [rows] = await db.execute(
    "SELECT * FROM emails WHERE sender=? AND starred=1 ORDER BY created_at DESC",
    [email]
  );
  res.json(rows);
};

export const getTheImportantMail = async (req, res) => {
  const { email } = req.params;
  const [rows] = await db.execute(
    "SELECT * FROM emails WHERE sender=? AND important=1 ORDER BY created_at DESC",
    [email]
  );
  res.json(rows);
};

export const getTheDraftMail = async (req, res) => {
  const { email } = req.params;
  const [rows] = await db.execute(
    "SELECT * FROM emails WHERE sender=? AND folder='draft' ORDER BY created_at DESC",
    [email]
  );
  res.json(rows);
};

export const getTheSentMail = async (req, res) => {
  const { email } = req.params;
  const [rows] = await db.execute(
    "SELECT * FROM emails WHERE recipient=? AND folder='sent' ORDER BY created_at DESC",
    [email]
  );
  res.json(rows);
};

export const getTheTrashMail = async (req, res) => {
  const { email } = req.params;
  const [rows] = await db.execute(
    "SELECT * FROM emails WHERE sender=? AND folder='trash' ORDER BY created_at DESC",
    [email]
  );
  res.json(rows);
};

export const getTheSinglemail = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.execute("SELECT * FROM emails WHERE id=?", [id]);
  res.json(rows[0]);
};

export const sendTheNewMail = async (req, res) => {
  const { recipient, subject, body } = req.body;
  const sender = "no-reply@tsgb.site";
  try {
    await sendEmail({ to: recipient, subject, html: body });
    await db.execute(
      "INSERT INTO emails (sender, recipient, subject, body, folder) VALUES (?, ?, ?, ?, 'sent')",
      [sender, recipient, subject, body]
    );
    await db.execute(
      "INSERT INTO emails (sender, recipient, subject, body, folder) VALUES (?, ?, ?, ?, 'inbox')",
      [sender, recipient, subject, body]
    );
    res.json({ message: "Email sent!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
