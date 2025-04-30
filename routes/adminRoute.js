import express from "express";
import {
  adminCreate,
  loginInfo,
  adminUpdate,
  registerAdmin,
  adminEmailInfo,
} from "../controllers/adminLogin.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { getHomepageControl, updateHomepageControl } from "../controllers/homepageController.js";

const adminRoute = express.Router();
// admin login
adminRoute.post("/api/adminlogin", loginInfo);
adminRoute.get("/api/dashboard", verifyAdmin, (req, res) => {
  res.status(200).json({ message: `Welcome Admin ${req.admin.email}` });
});
adminRoute.post("/api/registerAdmin", registerAdmin);
adminRoute.put("/admin/update/:id", adminUpdate);
adminRoute.put("/admin/create", adminCreate);
adminRoute.get("/admin/login", adminEmailInfo);
// adminRoute.get("/api/me", verifyAdmin, (req, res) => {
//   res.status(200).json({ user: req.admin });
// });

// logout route
adminRoute.post("/api/logout", (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/", // must match the path where cookie was set
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Homepage control routes
adminRoute.get("/api/homepage-control", getHomepageControl);
adminRoute.put("/api/homepage-control", verifyAdmin, updateHomepageControl);

export default adminRoute;
