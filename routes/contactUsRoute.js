import express from "express";
import {
  getContactUs,
  updateContactUs,
} from "../controllers/contactUsController.js";

const contactUsRoute = express.Router();

contactUsRoute.get("/admin-contact-us", getContactUs);
contactUsRoute.put("/admin-contact-us", updateContactUs);

export default contactUsRoute;
