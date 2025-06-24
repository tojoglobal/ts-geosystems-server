import db from "../Utils/db.js";

export const postEquipment = async (req, res) => {
  const {
    trackingNo,
    equipment,
    serialNo,
    accuracy,
    manufacturer,
    companyName,
    validity,
  } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO ts_cc_equipments
        (trackingNo, equipment, serialNo, accuracy, manufacturer, companyName, validity, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        trackingNo,
        equipment,
        serialNo,
        accuracy,
        manufacturer,
        companyName,
        validity,
      ]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const getEquipments = async (req, res) => {
//   const { trackingNo, serialNo } = req.query;

//   try {
//     if (trackingNo && serialNo) {
//       // If searching, return match only
//       const [rows] = await db.query(
//         "SELECT * FROM ts_cc_equipments WHERE trackingNo = ? AND serialNo = ?",
//         [trackingNo, serialNo]
//       );
//       res.status(200).json(rows);
//     } else {
//       // If not searching, return all
//       const [rows] = await db.query(
//         "SELECT * FROM ts_cc_equipments ORDER BY id DESC"
//       );
//       res.status(200).json(rows);
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const getEquipments = async (req, res) => {
  const { trackingNo, serialNo } = req.query;

  try {
    if (!trackingNo || !serialNo) {
      return res
        .status(400)
        .json({ error: "Both trackingNo and serialNo are required." });
    }

    const [rows] = await db.query(
      "SELECT * FROM ts_cc_equipments WHERE trackingNo = ? AND serialNo = ?",
      [trackingNo, serialNo]
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const putEquipment = async (req, res) => {
  const { id } = req.params;
  const {
    trackingNo,
    equipment,
    serialNo,
    accuracy,
    manufacturer,
    companyName,
    validity,
  } = req.body;
  try {
    await db.query(
      `UPDATE ts_cc_equipments SET
        trackingNo=?, equipment=?, serialNo=?, accuracy=?, manufacturer=?, companyName=?, validity=?, updated_at=NOW()
       WHERE id=?`,
      [
        trackingNo,
        equipment,
        serialNo,
        accuracy,
        manufacturer,
        companyName,
        validity,
        id,
      ]
    );
    res.json({ message: "Equipment updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEquipment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM ts_cc_equipments WHERE id=?", [id]);
    res.json({ message: "Equipment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
