import express from "express";
import {
  getTheInboxMail,
  getTheStarredMail,
  getTheImportantMail,
  getTheDraftMail,
  getTheSentMail,
  getTheTrashMail,
  getTheSinglemail,
  sendTheNewMail,
} from "../controllers/emailsControllers.js";
const emailRouter = express.Router();

emailRouter.get("/inbox/:email", getTheInboxMail);
emailRouter.get("/starred/:email", getTheStarredMail);
emailRouter.get("/important/:email", getTheImportantMail);
emailRouter.get("/draft/:email", getTheDraftMail);
emailRouter.get("/sent/:email", getTheSentMail);
emailRouter.get("/trash/:email", getTheTrashMail);
emailRouter.get("/:id", getTheSinglemail);
emailRouter.post("/send", sendTheNewMail);

export default emailRouter;
