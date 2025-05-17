import express from "express";
import { upload } from "../middleware/UploadFile.js";
import {
  createUserManuals,
  deleteUserManuals,
  getUserManuals,
  updateUserManuals,
} from "../controllers/userManualsController.js";

const UserManualsRoute = express.Router();

UserManualsRoute.get("/userManuals", getUserManuals);
UserManualsRoute.post(
  "/userManuals",
  upload.single("photo"),
  createUserManuals
);
UserManualsRoute.put(
  "/put-userManuals/:id",
  upload.single("photo"),
  updateUserManuals
);
UserManualsRoute.delete("/userManuals/:id", deleteUserManuals);

export default UserManualsRoute;
