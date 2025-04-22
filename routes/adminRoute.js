import express from "express";
import {
  adminCreate,
  adminLoginInfo,
  adminUpdate,
  registerAdmin,
} from "../controllers/adminLogin.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
const adminRoute = express.Router();
// admin login
adminRoute.post("/api/adminlogin", adminLoginInfo);
adminRoute.get("/api/dashboard", verifyAdmin, (req, res) => {
  res.status(200).json({ message: `Welcome Admin ${req.admin.email}` });
});
adminRoute.post("/api/registerAdmin", registerAdmin);
adminRoute.put("/admin/update/:id", adminUpdate);
adminRoute.put("/admin/create", adminCreate);

export default adminRoute;
