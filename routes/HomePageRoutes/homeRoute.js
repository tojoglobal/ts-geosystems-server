import express from "express";
import { upload } from "../../middleware/UploadFile.js";
import {
  getWeProvide,
  updateWeProvide,
  getOurAchievements,
  updateOurAchievements,
  getOurAdServices,
  updateOurAdServices,
} from "../../controllers/HomePageControllers/homeController.js";

const homeRoute = express.Router();

// WeProvide
homeRoute.get("/we-provide", getWeProvide);
homeRoute.put("/we-provide", updateWeProvide);
// Image upload for WeProvide
homeRoute.post("/we-provide/upload", upload.single("image"), (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  res.json({ success: true, imageUrl: `/uploads/${req.file.filename}` });
});

// OurAchievements
homeRoute.get("/our-achievements", getOurAchievements);
homeRoute.put("/our-achievements", updateOurAchievements);

// OurAdServices
homeRoute.get("/our-ad-services", getOurAdServices);
homeRoute.put("/our-ad-services", updateOurAdServices);

export default homeRoute;
