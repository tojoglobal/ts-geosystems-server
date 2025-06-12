import express from "express";
import { upload } from "./../../middleware/UploadFile.js";
import {
  GetAllSlides,
  UpdateSlides,
} from "../../controllers/HomePageControllers/SlideControllers.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";

const SlideRoutes = express.Router();

SlideRoutes.get("/slides", GetAllSlides);
SlideRoutes.put(
  "/slides/:id",
  upload.single("imageUrl"),
  verifyAdmin,
  UpdateSlides
);

export default SlideRoutes;
