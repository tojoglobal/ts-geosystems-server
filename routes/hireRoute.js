import express from "express";
import { getHire, updateHire } from "../controllers/hireController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/hire/" });
const hireRoute = express.Router();

hireRoute.get("/hire", getHire);
hireRoute.put("/hire", upload.single("image"), updateHire);

export default hireRoute;
