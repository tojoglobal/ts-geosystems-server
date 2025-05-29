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
homeRoute.put("/we-provide", upload.array("images", 3), updateWeProvide);

// OurAchievements
homeRoute.get("/our-achievements", getOurAchievements);
homeRoute.put("/our-achievements", updateOurAchievements);

// OurAdServices
homeRoute.get("/our-ad-services", getOurAdServices);
homeRoute.put("/our-ad-services", updateOurAdServices);

export default homeRoute;
