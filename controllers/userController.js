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
          console.error("Error generating JWT:", err.message);
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
    console.error("Error registering user:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
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
    const userId = user.id;
    const role = user.role;
    // Create JWT token
    const payload = { userId, email: user.email, role };
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "24h",
      },
      async (err, token) => {
        if (err) {
          console.error("Error generating JWT:", err.message);
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
        res.status(200).json({
          success: true,
          message: "Login successful",
          user: { id: userId, email, role },
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
    console.error("Error fetching users:", err.message);
    res.status(500).send("Server error");
  }
};
