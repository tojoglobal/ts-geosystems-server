import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../Utils/db.js";

export const addNewUser = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      postcode,
      phoneNumber,
      companyName,
      addressLine1,
      addressLine2,
      country,
      state,
      city,
    } = req.body;

    // Check if user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    await db.query(
      `INSERT INTO users 
        (email, password, first_name, last_name, postcode, phone_number, company_name, 
          address_line_1, address_line_2, country, state, city) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        hashedPassword,
        firstName,
        lastName,
        postcode,
        phoneNumber,
        companyName,
        addressLine1,
        addressLine2,
        country,
        state,
        city,
      ]
    );

    // Create JWT token
    const payload = { email };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).send("Server error");
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, email, first_name as firstName, last_name as lastName, postcode, phone_number as phoneNumber, company_name as companyName, address_line_1 as addressLine1, address_line_2 as addressLine2, country, state, city, created_at FROM users"
    );
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).send("Server error");
  }
};
