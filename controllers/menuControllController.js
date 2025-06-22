import db from "../Utils/db.js";

// Get all menu controls
export const getMenus = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM menu_controll");
  res.json(rows);
};

// Update a single menu's enabled state
export const updateMenu = async (req, res) => {
  const { menu_name, enabled } = req.body;
  if (!menu_name || typeof enabled === "undefined")
    return res.status(400).json({ message: "menu_name and enabled required" });

  const [result] = await db.query(
    "UPDATE menu_controll SET enabled=? WHERE menu_name=?",
    [!!enabled, menu_name]
  );
  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Menu not found" });
  res.json({ success: true });
};
