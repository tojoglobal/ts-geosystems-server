import express from "express";
import { getFooter, updateFooter } from "../controllers/footerController.js";
import { upload } from "../middleware/UploadFile.js";

const footerRoute = express.Router();

footerRoute.get("/footer", getFooter);
footerRoute.put("/footer", upload.single("iso_image"), updateFooter);

export default footerRoute;
