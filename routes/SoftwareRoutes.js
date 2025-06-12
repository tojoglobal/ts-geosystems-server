import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  getSoftwares,
  createSoftware,
  updateSoftware,
  deleteSoftware,
} from "../controllers/SoftwaresController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const SoftwareRoute = express.Router();

SoftwareRoute.get("/software", getSoftwares);
SoftwareRoute.post(
  "/software",
  upload.single("photo"),
  verifyAdmin,
  createSoftware
);
SoftwareRoute.put(
  "/software/:id",
  upload.single("photo"),
  verifyAdmin,
  updateSoftware
);
SoftwareRoute.delete("/software/:id", verifyAdmin, deleteSoftware);

export default SoftwareRoute;
