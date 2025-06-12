import express from "express";
import {
  getYoutubeVideos,
  updateYoutubeVideos,
} from "../../controllers/HomePageControllers/youtubeController.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";

const youtubeRoute = express.Router();

youtubeRoute.get("/our-youtube", getYoutubeVideos);
youtubeRoute.put("/our-youtube", verifyAdmin, updateYoutubeVideos);

export default youtubeRoute;
