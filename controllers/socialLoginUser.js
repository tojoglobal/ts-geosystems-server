import jwt from "jsonwebtoken";
import admin from "../Utils/firebaseAdmin.js";
import db from "../Utils/db.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const socialLoginUser = async (req, res) => {
  const { token } = req.body;

  const rawDummyPassword = crypto.randomBytes(16).toString("hex");
  const dummyPassword = await bcrypt.hash(rawDummyPassword, 10);

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;
    const role = "USER";
    // Check if user exists
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    let user;
    if (result.length === 0) {
      // Auto-create user if doesn't exist
      const [insertResult] = await db.query(
        "INSERT INTO users (email, role, password) VALUES (?, ?, ?)",
        [email, role, dummyPassword]
      );
      user = { id: insertResult.insertId, email, role };
    } else {
      user = result[0];
    }
    // Create JWT token
    const id = user.id;
    const paylod = { id, email: user.email, role: user.role };
    jwt.sign(
      paylod,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "24h",
      },
      async (err, token) => {
        if (err) {
          return res.status(500).json({ message: "Error generating token" });
        }

        // Optionally update user table with token
        await db.query("UPDATE users SET token = ? WHERE id = ?", [token, id]);
        // Set token in cookie (httpOnly)
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        // Final response
        res.status(200).json({
          success: true,
          message: "Login successful",
          user: { id, email, role },
        });
      }
    );
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
