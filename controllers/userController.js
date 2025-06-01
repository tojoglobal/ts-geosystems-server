import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../Utils/db.js";
import sendEmail from "../Utils/sendEmail.js";

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

    // Default role
    const role = "USER";

    // Insert new user into the database
    const [result] = await db.query(
      `INSERT INTO users 
        (email, password, first_name, last_name, postcode, phone_number, company_name,address_line_1, address_line_2, country, state, city , role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`,
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
        role,
      ]
    );
    const userId = result.insertId;
    // Add the initial address to addresses table
    await db.query(
      `INSERT INTO addresses 
    (user_id, first_name, last_name, company, address_line_1, address_line_2, city, state, postcode, country, phone) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        firstName,
        lastName,
        companyName,
        addressLine1,
        addressLine2,
        city,
        state,
        postcode,
        country,
        phoneNumber,
      ]
    );
    // Send welcome email
    const html = `
      <table role="presentation" style="width:100%; border-collapse:collapse; border:0; border-spacing:0; background:#ffffff;">
        <tr>
          <td align="center" style="padding:0;">
            <table role="presentation" style="width:600px; border-collapse:collapse; border-spacing:0; text-align:left; font-family:Arial,sans-serif;">
              <tr>
                <td style="padding:20px 0; background:#d8233c; text-align:center; color:#fff; font-weight:bold;">
                  FREE SHIPPING ON QUALIFIED ORDERS
                </td>
              </tr>
              <tr>
                <td style="padding:40px 30px; text-align:center;">
                  <h2 style="margin:0; font-size:24px; color:#000;">Welcome to G2 Survey</h2>
                  <p style="margin:20px 0; font-size:16px; color:#555;">
                    Thank you ${firstName} for creating your account. Next time you shop with us, log in for faster checkout.
                  </p>
                  <a href="https://tsgb.site" style="display:inline-block; background:#d8233c; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px; font-weight:bold;">
                    Visit Store
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:30px; background:#f2f2f2; text-align:center;">
                  <h3 style="margin:0 0 15px; font-size:18px; color:#000;">Have Questions?</h3>
                  <a href="mailto:support@tsgb.site" style="display:inline-block; background:#d8233c; color:#fff; padding:10px 20px; text-decoration:none; border-radius:4px; font-weight:bold;">
                    CONTACT US
                  </a>
                </td>
              </tr>
              <tr>
                <td style="background:#d8233c; color:#fff; text-align:center; padding:20px; font-size:14px;">
                  Unit 8 & 9, Theale Lakes Business Park, Moulden Way, Theale, Reading, RG7 4GB
                  <br><br>
                  <span style="font-size:12px;">No longer want to receive these emails? <a href="#" style="color:#fff; text-decoration:underline;">Unsubscribe</a></span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    await sendEmail({
      to: email,
      subject: "Thanks for Registering at TSGB Survey!",
      html,
    });

    // Create JWT token
    const payload = { id: userId, email, role };
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "24h",
      },
      async (err, token) => {
        if (err) {
          return res.status(500).json({ message: "Error generating token" });
        }

        // Optionally update user table with token
        await db.query("UPDATE users SET token = ? WHERE id = ?", [
          token,
          userId,
        ]);

        // Set token in cookie (httpOnly)
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Final response
        res.status(201).json({
          message: "User registered successfully",
          user: { id: userId, email, role, firstName, lastName },
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        loginStatus: false,
        Error: "Email and password are required",
      });
    }
    const [result] = await db.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    // Check if the user exists
    if (result.length === 0) {
      return res
        .status(401)
        .json({ loginStatus: false, Error: "Wrong email or password" });
    }

    const user = result[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ loginStatus: false, Error: "Wrong password" });
    }
    const id = user.id;
    const role = user.role;
    // Create JWT token
    const payload = { id, email: user.email, role };
    jwt.sign(
      payload,
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
    res.status(500).json({ success: false, error: "Something went wrong" });
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
    res.status(500).send("Server error");
  }
};

// GET /api/getUserInfo/:email
export const getSingleUserInfo = async (req, res) => {
  try {
    const { email } = req.params;

    const [user] = await db.query(
      "SELECT id, email, first_name as firstName, last_name as lastName,  phone_number as phoneNumber, company_name as companyName, created_at FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json(user[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const {
      id,
      email,
      firstName,
      lastName,
      phoneNumber,
      companyName,
      password,
      confirmPassword,
      currentPassword,
    } = req.body;

    console.log(
      id,
      email,
      firstName,
      lastName,
      phoneNumber,
      companyName,
      password,
      confirmPassword,
      currentPassword
    );

    // Fetch current user details
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = user[0];
    const updates = {};

    // Update email
    if (email && email !== currentUser.email) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required to change the email.",
        });
      }
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid current password." });
      }

      updates.email = email;

      // Send email to the old email address
      const message = `
        Your email has been updated. If you did not request this change, please contact support immediately.
      `;
      await sendEmail({
        to: currentUser.email,
        subject: "Email Updated",
        text: message,
      });
    }

    // Update password
    if (password) {
      if (password.length < 6 || !/[a-zA-Z]/.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters and contain at least one alphabet.",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid current password." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    // Update other fields
    if (firstName && firstName !== currentUser.first_name)
      updates.first_name = firstName;
    if (lastName && lastName !== currentUser.last_name)
      updates.last_name = lastName;
    if (phoneNumber && phoneNumber !== currentUser.phone_number)
      updates.phone_number = phoneNumber;
    if (companyName && companyName !== currentUser.company_name)
      updates.company_name = companyName;

    // Apply updates to the database
    const updateKeys = Object.keys(updates);
    if (updateKeys.length > 0) {
      const sql = `
        UPDATE users
        SET ${updateKeys.map((key) => `${key} = ?`).join(", ")}
        WHERE id = ?
      `;
      const values = [...updateKeys.map((key) => updates[key]), id];

      await db.query(sql, values);
    }

    res.status(200).json({ message: "User details updated successfully." });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Server error." });
  }
};
