import express from "express";
import {
  addNewUser,
  getSingleUserInfo,
  getUsers,
  loginUser,
  updateUserInfo,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import db from "../Utils/db.js";
import { socialLoginUser } from "../controllers/socialLoginUser.js";

const userRoutes = express.Router();

userRoutes.post("/add-user", addNewUser);
userRoutes.get("/all-users", getUsers);
userRoutes.post("/user-login", loginUser);

// get the user only email
userRoutes.get("/getUserInfo/:email", authenticateUser, getSingleUserInfo);

userRoutes.get("/user-verify-token", authenticateUser, (req, res) => {
  res.status(200).json({
    valid: true,
    user: req.user,
  });
});

// Logout route
userRoutes.post("/user-logout", async (req, res) => {
  try {
    // const userId = req.user.id;
    const userEmail = req.body.email;

    // Clear the authToken from the user's cookies
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    // Remove the token from the database
    await db.query("UPDATE users SET token = NULL WHERE email = ?", [
      userEmail,
    ]);

    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred during logout." });
  }
});

userRoutes.post("/social-login", socialLoginUser);

// Update user information
userRoutes.put("/updateUserInfo", updateUserInfo);

export default userRoutes;
