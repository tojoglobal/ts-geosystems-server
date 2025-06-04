import express from "express";
import { upload } from "../middleware/UploadFile.js";
import { getAllCreditAccountApplications, saveCreditAccountApplication } from "../controllers/creditAccountController.js";

const creditAccountRoute = express.Router();

// Save form data and files
creditAccountRoute.post(
  "/credit-accounts",
  upload.array("files"),
  saveCreditAccountApplication
);

// Retrieve all form submissions
creditAccountRoute.get("/credit-accounts", getAllCreditAccountApplications);

export default creditAccountRoute;
