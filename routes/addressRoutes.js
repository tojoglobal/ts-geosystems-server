import express from "express";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const addressRoute = express.Router();

addressRoute.get("/", authenticateUser, getAddresses);
addressRoute.post("/", authenticateUser, addAddress);
addressRoute.put("/", authenticateUser, updateAddress);
addressRoute.delete("/:id", authenticateUser, deleteAddress);

export default addressRoute;
