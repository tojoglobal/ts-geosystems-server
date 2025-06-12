import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  getCertificateTracking,
  updateCertificateTracking,
} from "../controllers/certificateTrackingController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const cTRouter = express.Router();

cTRouter.get("/certificate-description", getCertificateTracking);
cTRouter.put(
  "/certificate-description",
  upload.single("image"),
  verifyAdmin,
  updateCertificateTracking
);

export default cTRouter;
