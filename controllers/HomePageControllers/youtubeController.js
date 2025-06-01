import db from "../../Utils/db.js";

export const getYoutubeVideos = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM youtube_videos ORDER BY id ASC LIMIT 3"
  );
  const section_title = rows[0]?.section_title || "OUR YOUTUBE CHANNEL";
  res.json({ section_title, items: rows });
};

export const updateYoutubeVideos = async (req, res) => {
  // expects { section_title, items: [{link}, ...] }
  const { section_title = "OUR YOUTUBE CHANNEL", items = [] } = req.body;

  await db.query("DELETE FROM youtube_videos");
  for (const item of items.slice(0, 3)) {
    await db.query(
      "INSERT INTO youtube_videos (section_title, link) VALUES (?, ?)",
      [section_title, item.link]
    );
  }
  res.json({ success: true });
};
