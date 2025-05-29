import db from "../../Utils/db.js";
import fs from "fs";
import path from "path";

// -------- WeProvide --------
export const getWeProvide = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM we_provide");
  res.json(
    rows.map((row) => ({
      ...row,
      description: JSON.parse(row.description),
    }))
  );
};

export const updateWeProvide = async (req, res) => {
  // Expecting: req.body = [{title, image, description: [...]}, ...]
  const items = req.body.slice(0, 3); // Always max 3!
  await db.query("DELETE FROM we_provide");
  for (const item of items) {
    await db.query(
      "INSERT INTO we_provide (title, image, description) VALUES (?, ?, ?)",
      [item.title, item.image, JSON.stringify(item.description)]
    );
  }
  res.json({ success: true });
};

// -------- OurAchievements --------
export const getOurAchievements = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM our_achievements");
  res.json(rows.slice(0, 3)); // Always return top 3
};

export const updateOurAchievements = async (req, res) => {
  const items = req.body.slice(0, 3);
  await db.query("DELETE FROM our_achievements");
  for (const item of items) {
    await db.query(
      "INSERT INTO our_achievements (number, text) VALUES (?, ?)",
      [item.number, item.text]
    );
  }
  res.json({ success: true });
};

// -------- OurAdServices --------
export const getOurAdServices = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM our_ad_services");
  res.json(rows);
};

export const updateOurAdServices = async (req, res) => {
  const items = req.body;
  await db.query("DELETE FROM our_ad_services");
  for (const item of items) {
    await db.query(
      "INSERT INTO our_ad_services (title, description) VALUES (?, ?)",
      [item.title, item.description]
    );
  }
  res.json({ success: true });
};
