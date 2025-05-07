import express from "express";
import { addNewUser, getUsers } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/add-user", addNewUser);
userRoutes.get("/all-users", getUsers);

export default userRoutes;
