import express from "express";
import {
  adminCreate,
  loginInfo,
  adminUpdate,
  registerAdmin,
  adminEmailInfo,
  adminGetProfile,
  adminProfileUpdate,
  adminUnlock,
} from "../controllers/adminLogin.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { upload } from "../middleware/UploadFile.js";

const adminRoute = express.Router();
// admin login
adminRoute.post("/api/adminlogin", loginInfo);
adminRoute.get("/api/dashboard", verifyAdmin, (req, res) => {
  res.status(200).json({ message: `Welcome Admin ${req.admin.email}` });
});
// unlock screen api
adminRoute.post("/api/admin/unlock", verifyAdmin, adminUnlock);
adminRoute.post("/api/registerAdmin", registerAdmin);
adminRoute.put("/admin/update/:id", adminUpdate);
adminRoute.put("/admin/create", adminCreate);
adminRoute.get("/admin/login", adminEmailInfo);

// Admin profile GET (by ID) /:id
adminRoute.get("/api/admin/profile", verifyAdmin, adminGetProfile);

// Admin profile UPDATE (by ID, PUT)
adminRoute.put(
  "/api/admin/profile",
  verifyAdmin,
  upload.single("photo"),
  adminProfileUpdate
);

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

export default adminRoute;
