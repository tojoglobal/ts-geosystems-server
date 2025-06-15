import express from "express";
import {
  addSubscriber,
  deleteSubscriber,
  getAllSubscribers,
  getHomepageControl,
  updateHomepageControl,
} from "../controllers/homepageController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const HomePageControlRoute = express.Router();

HomePageControlRoute.get("/homepage-control", getHomepageControl);
// HomePageControlRoute.post(
//   "/softwar",
//   upload.single("photo"),
//   HomePageControlRoute
// );
HomePageControlRoute.put(
  "/homepage-control",
  verifyAdmin,
  updateHomepageControl
);
// HomePageControlRoute.delete("/softwar/:id", deleteSoftware);
HomePageControlRoute.post("/subscribers", addSubscriber);
HomePageControlRoute.get("/subscribers", getAllSubscribers);
HomePageControlRoute.delete("/subscribers/:id", verifyAdmin, deleteSubscriber);

export default HomePageControlRoute;
