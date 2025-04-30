import express from "express";
import {
  getHomepageControl,
  updateHomepageControl,
} from "../controllers/homepageController.js";

const HomePageControlRoute = express.Router();

HomePageControlRoute.get("/homepage-control", getHomepageControl);
// HomePageControlRoute.post(
//   "/softwar",
//   upload.single("photo"),
//   HomePageControlRoute
// );
HomePageControlRoute.put("/homepage-control", updateHomepageControl);
// HomePageControlRoute.delete("/softwar/:id", deleteSoftware);

export default HomePageControlRoute;
