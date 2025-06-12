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
import { verifyAdmin } from "../../middleware/verifyAdmin.js";

const homeRoute = express.Router();

// WeProvide
homeRoute.get("/we-provide", getWeProvide);
homeRoute.put(
  "/we-provide",
  upload.fields([
    { name: "images[0]", maxCount: 1 },
    { name: "images[1]", maxCount: 1 },
    { name: "images[2]", maxCount: 1 },
  ]),
  verifyAdmin,
  updateWeProvide
);


// OurAchievements
homeRoute.get("/our-achievements", getOurAchievements);
homeRoute.put("/our-achievements", verifyAdmin, updateOurAchievements);

// OurAdServices
homeRoute.get("/our-ad-services", getOurAdServices);
homeRoute.put("/our-ad-services", verifyAdmin, updateOurAdServices);

export default homeRoute;
