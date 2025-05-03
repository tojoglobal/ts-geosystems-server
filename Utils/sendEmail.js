// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Your Shop Name" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Thank-you email sent");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export default sendEmail;
