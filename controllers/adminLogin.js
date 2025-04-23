import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../Utils/db.js";
import { log } from "console";

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
const adminLoginInfo = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return req.status(400).json({
        loginStatus: false,
        Error: "Email and password are required",
      });
    }
    const [result] = await db.query(`SELECT * FROM admins WHERE email = ?`, [
      email,
    ]);

    //   check the admin exists
    if (result.length === 0) {
      return res
        .status(401)
        .json({ loginStatus: false, Error: "wrong email and passsword" });
    }
    const admin = result[0];
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ loginStatus: false, Error: "Wrong password" });
    }
    //Generate jwt token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      // sameSite: "Lax",
      maxAge: 86400000,
    });
    res.status(200).json({ success: true, message: "Login successful" });
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
    console.error("Error in adminCreate:", error);
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
    console.error("Error in adminUpdate:", error);
    return res.status(500).json({ error: "Failed to update admin" });
  }
};

const adminEmailInfo = async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);

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

export {
  adminLoginInfo,
  adminCreate,
  adminUpdate,
  registerAdmin,
  adminEmailInfo,
};
