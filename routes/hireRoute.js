import express from "express";
import { getHire, updateHire } from "../controllers/hireController.js";

const hireRoute = express.Router();

hireRoute.get("/hire", getHire);
hireRoute.put("/hire", updateHire);

export default hireRoute;
