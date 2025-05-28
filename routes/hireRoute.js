import express from "express";
import {
  getHire,
  getHireContent,
  getHireEquipment,
  hireUpdateEquipment,
  saveHireEnquiry,
  updateHire,
} from "../controllers/hireController.js";
import { upload } from "../middleware/UploadFile.js";

// const upload = multer({ dest: "uploads/hire/" });
const hireRoute = express.Router();

hireRoute.get("/hire", getHire);
hireRoute.put("/hire", upload.single("image"), updateHire);

// POST API to save hire enquiries
hireRoute.post("/hire", saveHireEnquiry);
hireRoute.get("/hire-enquiries", getHireContent);
hireRoute.get("/equipment", getHireEquipment);
hireRoute.put("/equipment/:id", upload.single("image"), hireUpdateEquipment);

export default hireRoute;
