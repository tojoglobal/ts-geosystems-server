import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  getSoftwares,
  createSoftware,
  updateSoftware,
  deleteSoftware,
} from "../controllers/SoftwaresController.js";

const SoftwareRoute = express.Router();

SoftwareRoute.get("/softwar", getSoftwares);
SoftwareRoute.post("/softwar", upload.single("photo"), createSoftware);
SoftwareRoute.put("/softwar/:id", upload.single("photo"), updateSoftware);
SoftwareRoute.delete("/softwar/:id", deleteSoftware);

export default SoftwareRoute;
