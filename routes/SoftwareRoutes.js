import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  getSoftwares,
  createSoftware,
  updateSoftware,
  deleteSoftware,
} from "../controllers/SoftwaresController.js";

const SoftwareRoute = express.Router();

SoftwareRoute.get("/software", getSoftwares);
SoftwareRoute.post("/software", upload.single("photo"), createSoftware);
SoftwareRoute.put("/software/:id", upload.single("photo"), updateSoftware);
SoftwareRoute.delete("/software/:id", deleteSoftware);

export default SoftwareRoute;
