import express from "express";
import {
  createServiceInquiry,
  deleteServiceInquiry,
  getService,
  getServiceEquipmentOptions,
  getServiceImages,
  getServiceInquiries,
  updateService,
  updateServiceEquipmentOptions,
  updateServiceImages,
} from "../controllers/serviceController.js";
import { upload } from "../middleware/UploadFile.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

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

serviceRoute.put(
  "/update-service-images",
  upload.any(),
  verifyAdmin,
  updateServiceImages
);
serviceRoute.get("/get-service-images", getServiceImages);

// service page service inquiries from
serviceRoute.get("/service-inquiries", getServiceInquiries);
serviceRoute.post(
  "/service-inquiries",
  upload.array("files"),
  createServiceInquiry
);

serviceRoute.get("/service-equipment-options", getServiceEquipmentOptions);
serviceRoute.put(
  "/service-equipment-options",
  verifyAdmin,
  updateServiceEquipmentOptions
);

serviceRoute.delete(
  "/service-inquiries/:id",
  verifyAdmin,
  deleteServiceInquiry
);

export default serviceRoute;
