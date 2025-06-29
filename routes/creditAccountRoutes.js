import express from "express";
import { upload } from "../middleware/UploadFile.js";
import { deleteCreditAccountApplication, getAllCreditAccountApplications, saveCreditAccountApplication } from "../controllers/creditAccountController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const creditAccountRoute = express.Router();

// Save form data and files
creditAccountRoute.post(
  "/credit-accounts",
  upload.array("files"),
  saveCreditAccountApplication
);

// Retrieve all form submissions
creditAccountRoute.get(
  "/credit-accounts",
  verifyAdmin,
  getAllCreditAccountApplications
);

creditAccountRoute.delete(
  "/credit-accounts/:id",
  verifyAdmin,
  deleteCreditAccountApplication
);

export default creditAccountRoute;
