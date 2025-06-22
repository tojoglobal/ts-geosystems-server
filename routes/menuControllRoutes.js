import express from "express";
import { getMenus, updateMenu } from "../controllers/menuControllController.js";

const menuControllRoutes = express.Router();

menuControllRoutes.get("/", getMenus);
menuControllRoutes.put("/", updateMenu);

export default menuControllRoutes;
