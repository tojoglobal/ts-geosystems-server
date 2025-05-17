import express from "express";
import {
  getService,
  getServiceImages,
  updateService,
  updateServiceImages,
} from "../controllers/serviceController.js";
import { upload } from "../middleware/UploadFile.js";

// const upload = multer({ dest: "uploads/service/" });
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

serviceRoute.put("/update-service-images", upload.any(), updateServiceImages);
serviceRoute.get("/get-service-images", getServiceImages);

export default serviceRoute;
