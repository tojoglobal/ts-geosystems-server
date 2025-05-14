import jwt from "jsonwebtoken";
import db from "../Utils/db.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ message: "Not authorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);

    console.log(decoded.userId);

    // Fetch user from the database
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ? AND token = ?",
      [decoded.userId, token]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Role guard
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};
