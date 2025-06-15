import express from "express";
import * as ctrl from "../controllers/dynamicLinksController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const dynamicLinksRoute = express.Router();

dynamicLinksRoute.get("/dynamic-links", ctrl.getDynamicLinks);
dynamicLinksRoute.get("/dynamic-links/:slug", ctrl.getDynamicLinkBySlug);
dynamicLinksRoute.post("/dynamic-links", verifyAdmin, ctrl.createDynamicLink);
dynamicLinksRoute.put(
  "/dynamic-links/:id",
  verifyAdmin,
  ctrl.updateDynamicLink
);
dynamicLinksRoute.delete(
  "/dynamic-links/:id",
  verifyAdmin,
  ctrl.deleteDynamicLink
);

export default dynamicLinksRoute;
