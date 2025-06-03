import express from "express";
import * as ctrl from "../controllers/dynamicLinksController.js";

const dynamicLinksRoute = express.Router();

dynamicLinksRoute.get("/dynamic-links", ctrl.getDynamicLinks);
dynamicLinksRoute.get("/dynamic-links/:slug", ctrl.getDynamicLinkBySlug);
dynamicLinksRoute.post("/dynamic-links", ctrl.createDynamicLink);
dynamicLinksRoute.put("/dynamic-links/:id", ctrl.updateDynamicLink);
dynamicLinksRoute.delete("/dynamic-links/:id", ctrl.deleteDynamicLink);

export default dynamicLinksRoute;
