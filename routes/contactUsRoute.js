import express from "express";
import {
  getContactUs,
  updateContactUs,
  submitContactForm,
  getContactMessages,
  deleteContactMessage,
} from "../controllers/contactUsController.js";

const contactUsRoute = express.Router();

contactUsRoute.get("/admin-contact-us", getContactUs);
contactUsRoute.put("/admin-contact-us", updateContactUs);

// Contact form submission (public)
contactUsRoute.post("/contact", submitContactForm);

// Get all contact messages (admin)
contactUsRoute.get("/contact-messages", getContactMessages);

// Delete a contact message (admin)
contactUsRoute.delete("/contact-messages/:id", deleteContactMessage);

export default contactUsRoute;
