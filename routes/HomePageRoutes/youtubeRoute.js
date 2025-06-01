import express from "express";
import {
  getYoutubeVideos,
  updateYoutubeVideos,
} from "../../controllers/HomePageControllers/youtubeController.js";

const youtubeRoute = express.Router();

youtubeRoute.get("/our-youtube", getYoutubeVideos);
youtubeRoute.put("/our-youtube", updateYoutubeVideos);

export default youtubeRoute;
