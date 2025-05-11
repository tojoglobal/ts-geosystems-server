import express from "express";
import {
  getContactUs,
  updateContactUs,
  getCertificateDescription,
  updateCertificateDescription,
} from "../controllers/contactUsController.js";

const contactUsRoute = express.Router();

contactUsRoute.get("/admin-contact-us", getContactUs);
contactUsRoute.put("/admin-contact-us", updateContactUs);
contactUsRoute.get("/certificate-description", getCertificateDescription);
contactUsRoute.put("/certificate-description", updateCertificateDescription);

export default contactUsRoute;
