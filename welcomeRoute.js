import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const currentYear = new Date().getFullYear(); // Get current year
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>TSGB Server</title>
      <link href="https://fonts.googleapis.com/css?family=Montserrat:700,400&display=swap" rel="stylesheet">
      <style>
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          min-height: 100vh;
          background: linear-gradient(135deg, #1b1d36 0%, #e62245 100%);
          color: #fff;
          font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: rgba(24, 27, 52, 0.85);
          border-radius: 24px;
          box-shadow: 0 8px 40px 0 rgba(40,30,70,0.25);
          padding: 48px 32px 40px 32px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .container::before {
          content: '';
          position: absolute;
          top: -90px;
          left: -90px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, #e62245 0%, transparent 70%);
          opacity: 0.18;
          z-index: 0;
        }
        .container::after {
          content: '';
          position: absolute;
          bottom: -90px;
          right: -90px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, #fff 0%, transparent 80%);
          opacity: 0.07;
          z-index: 0;
        }
        h1 {
          font-size: 2.4rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 16px;
          background: linear-gradient(90deg, #fff 60%, #e62245 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          font-size: 1.09rem;
          color: #d9dbe9;
          margin-bottom: 32px;
          font-weight: 400;
        }
        .divider {
          width: 60px;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, #e62245, #fff);
          margin: 0 auto 32px auto;
          animation: slide 2.2s infinite alternate cubic-bezier(.5, .2, .2, 1);
        }
        @keyframes slide {
          from { width: 40px; }
          to { width: 60px; }
        }
        .info {
          font-size: 1rem;
          color: #bfbfd9;
          margin-bottom: 16px;
        }
        .footer {
          font-size: 0.92rem;
          color: #e62245;
          letter-spacing: 0.2em;
          margin-top: 28px;
          font-weight: 700;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .container { padding: 32px 12px; }
          h1 { font-size: 1.5rem; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>TSGB Server</h1>
        <div class="subtitle">Welcome to the Official Backend API of <b>TSGB</b></div>
        <div class="divider"></div>
        <div class="info">
          This is a secure, high-performance, enterprise-grade server.<br/>
          <span style="color:#fff;font-weight:600;">API is live &amp; healthy.</span>
        </div>
        <div class="info" style="font-size: 0.95rem;">
          For documentation, please contact the TSGB team or your administrator.<br>
          <span style="color:#e62245; font-weight: 600;">Admin Access Required</span>
        </div>
        <div class="footer">&copy; TSGB ${currentYear} &mdash; All rights reserved.</div>
      </div>
    </body>
    </html>
  `);
});

export default router;
