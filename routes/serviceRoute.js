import express from "express";
import { getService, updateService } from "../controllers/serviceController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/service/" });
const serviceRoute = express.Router();

serviceRoute.get("/service", getService);
serviceRoute.put(
  "/service",
  upload.fields([
    { name: "imageGrid", maxCount: 1 },
    { name: "imageBanner", maxCount: 1 },
  ]),
  updateService
);

export default serviceRoute;
