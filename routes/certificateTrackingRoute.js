import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  getCertificateTracking,
  updateCertificateTracking,
} from "../controllers/certificateTrackingController.js";

const cTRouter = express.Router();

cTRouter.get("/certificate-description", getCertificateTracking);
cTRouter.put(
  "/certificate-description",
  upload.single("image"),
  updateCertificateTracking
);

export default cTRouter;
