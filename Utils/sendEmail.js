// import dotenv from "dotenv";
// dotenv.config();
// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "mail.tsgb.site",
//   port: 587, // use 587 if 465 doesn't work
//   secure: false, // true for 465, false for 587
//   // auth: {
//   //   user: process.env.EMAIL_USER,
//   //   pass: process.env.EMAIL_PASS,
//   // },
// });
// export default async function sendEmail({ to, subject, html }) {
//   try {
//     await transporter.sendMail({
//       from: `"TSGB" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });
//     console.log("✅ Email sent to", to);
//   } catch (error) {
//     console.error("❌ Failed to send email:", error);
//   }
// }
