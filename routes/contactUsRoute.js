import express from "express";
import { getContactUs, updateContactUs } from "../controllers/contactUsController";

const router = express.Router();

router.get("/admin-contact-us", getContactUs);
router.put("/admin-contact-us", updateContactUs);

export default router;
