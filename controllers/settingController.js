import db from "../Utils/db.js";

export const getVatSetting = async (req, res) => {
  const [rows] = await db.query(
    "SELECT vat_enabled FROM shop_settings LIMIT 1"
  );
  res.json({ vat_enabled: rows.length ? !!rows[0].vat_enabled : true });
};

export const setVatSetting = async (req, res) => {
  const { vat_enabled } = req.body;
  await db.query("UPDATE shop_settings SET vat_enabled=? LIMIT 1", [
    vat_enabled ? 1 : 0,
  ]);
  res.json({ success: true, vat_enabled: !!vat_enabled });
};
