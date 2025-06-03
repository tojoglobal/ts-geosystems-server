import db from "../Utils/db.js";

export const getDynamicLinks = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM dynamic_links ORDER BY id ASC");
  res.json({ success: true, data: rows });
};

export const getDynamicLinkBySlug = async (req, res) => {
  const { slug } = req.params;
  const [rows] = await db.query("SELECT * FROM dynamic_links WHERE slug = ?", [
    slug,
  ]);
  if (rows.length === 0) return res.status(404).json({ success: false });
  res.json({ success: true, data: rows[0] });
};

export const createDynamicLink = async (req, res) => {
  const { name, slug, description, show_in_footer, show_in_header } = req.body;
  await db.query(
    "INSERT INTO dynamic_links (name, slug, description, show_in_footer, show_in_header) VALUES (?, ?, ?, ?, ?)",
    [name, slug, description || "", !!show_in_footer, !!show_in_header]
  );
  res.json({ success: true });
};

export const updateDynamicLink = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, show_in_footer, show_in_header } = req.body;
  await db.query(
    "UPDATE dynamic_links SET name=?, slug=?, description=?, show_in_footer=?, show_in_header=? WHERE id=?",
    [name, slug, description, !!show_in_footer, !!show_in_header, id]
  );
  res.json({ success: true });
};

export const deleteDynamicLink = async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM dynamic_links WHERE id=?", [id]);
  res.json({ success: true });
};
