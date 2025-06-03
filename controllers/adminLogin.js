import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../Utils/db.js";

const registerAdmin = async (req, res) => {
  try {
    const { email, passsword } = req.body;
    if (!email || !passsword) {
      return res.status(400).json({ Error: "email and Password are required" });
    }
    // hash the password before the saving
    const hashedPassword = await bcrypt.hash(passsword, 10);

    // insert admin data into the datbase
    await db.query("INSERT INTO admins (email , password , type) VALUES (?)", [
      email,
      hashedPassword,
      "admin",
    ]);
  } catch (error) {
    return res.status(500).json({ Error: "Registration failed" });
  }
};

// hash the password before the saving
const loginInfo = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        loginStatus: false,
        Error: "Email and password are required",
      });
    }

    const [result] = await db.query(`SELECT * FROM admins WHERE email = ?`, [
      email,
    ]);

    // Check if the admin exists
    if (result.length === 0) {
      return res
        .status(401)
        .json({ loginStatus: false, Error: "Wrong email or password" });
    }

    const admin = result[0];
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ loginStatus: false, Error: "Wrong password" });
    }

    // Determine the role based on `role_id`
    const role = admin.role_id === 0 ? "admin" : "moderator";

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Set the token as a cookie
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      // domain: ".tsgb.site",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      adminInfo: { adminId: admin.id, adminEmail: admin.email, role },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// CREATE ADMIN ACCOUNT WITH FULL DETAILS
const adminCreate = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      photo, // this should be the file path or base64 string
      role_id,
      password,
      email_token,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    // Check if email already exists
    const [existingAdmin] = await db.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );
    if (existingAdmin.length > 0) {
      return res
        .status(409)
        .json({ error: "Admin with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin
    await db.query(
      `INSERT INTO admins (name, email, phone, photo, role_id, password, email_token, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email, phone, photo, role_id, hashedPassword, email_token]
    );

    return res.status(201).json({ message: "Admin created successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create admin." });
  }
};

const adminUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, photo, role_id, password, email_token } =
      req.body;

    // First, check if the admin exists
    const [existing] = await db.query("SELECT * FROM admins WHERE id = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Prepare updated fields
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (photo) updates.photo = photo;
    if (role_id) updates.role_id = role_id;
    if (email_token) updates.email_token = email_token;
    if (password) updates.password = await bcrypt.hash(password, 10);

    // Dynamically build the query
    const updateFields = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(", ");

    const values = Object.values(updates);
    values.push(id); // Add `id` for WHERE clause

    await db.query(
      `UPDATE admins SET ${updateFields}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update admin" });
  }
};

const adminEmailInfo = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ Error: "Email is required" });
    }
    const [result] = await db.query(`SELECT * FROM admins WHERE email = ?`, [
      email,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ Error: "Admin not found" });
    }
    return res.status(200).json({ message: "Admin found", data: result[0] });
  } catch (error) {
    return res.status(500).json({ Error: "Something went wrong" });
  }
};

// GET admin profile by ID (for profile view or edit, excluding sensitive fields)
const adminGetProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const [result] = await db.query(
      "SELECT name, email, phone, role_id as role, photo, facebook, instagram, linkedin, twitter FROM admins WHERE id = ?",
      [adminId]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin profile." });
  }
};

// PUT admin profile update (skip password, role_id, email_token, created_at)
const adminProfileUpdate = async (req, res) => {
  try {
    const adminId = req.admin.id; // use from token
    const { name, email, phone, facebook, instagram, linkedin, twitter } =
      req.body;

    // Handle photo upload (from multer)
    let photo = undefined;
    if (req.file && req.file.filename) {
      photo = req.file.filename;
    }

    // Check if admin exists
    const [existing] = await db.query("SELECT * FROM admins WHERE id = ?", [
      adminId,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Prepare update fields (only allowed fields)
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (photo) updates.photo = photo;
    if (facebook) updates.facebook = facebook;
    if (instagram) updates.instagram = instagram;
    if (linkedin) updates.linkedin = linkedin;
    if (twitter) updates.twitter = twitter;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields to update." });
    }

    // Build dynamic query
    const updateFields = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(adminId);

    await db.query(
      `UPDATE admins SET ${updateFields}, updated_at = NOW() WHERE id = ?`,
      values
    );

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile." });
  }
};

// POST adminUnlock
const adminUnlock = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ success: false, error: "Password is required." });
    }

    // Fetch admin's hashed password
    const [result] = await db.query(
      "SELECT password FROM admins WHERE id = ?",
      [adminId]
    );
    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Admin not found." });
    }

    const hash = result[0].password;
    const match = await bcrypt.compare(password, hash);

    if (!match) {
      return res
        .status(401)
        .json({ success: false, error: "Incorrect password." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Unlock successful." });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Unlock failed." });
  }
};

export {
  loginInfo,
  adminCreate,
  adminUpdate,
  registerAdmin,
  adminEmailInfo,
  adminProfileUpdate,
  adminGetProfile,
  adminUnlock,
};
