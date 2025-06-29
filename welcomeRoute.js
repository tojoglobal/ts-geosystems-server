import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const currentYear = new Date().getFullYear();
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TSGB Server</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: linear-gradient(135deg, #1a1a2e 0%, #e62245 100%);
          font-family: 'Montserrat', sans-serif;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          overflow: hidden;
        }
        .circles {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          z-index: 0;
          pointer-events: none;
        }
        .circles li {
          position: absolute;
          display: block;
          list-style: none;
          width: 20px; height: 20px;
          background: rgba(255,255,255,0.08);
          animation: animate 25s linear infinite;
          bottom: -150px;
          border-radius: 50%;
        }
        .circles li:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
        .circles li:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s;}
        .circles li:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s;}
        .circles li:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s;}
        .circles li:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s;}
        .circles li:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s;}
        .circles li:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s;}
        .circles li:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s;}
        .circles li:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s;}
        .circles li:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s;}
        @keyframes animate {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 0;}
          100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%;}
        }
        .container {
          text-align: center;
          position: relative;
          z-index: 1;
          padding: 3rem 2rem 2.2rem 2rem;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          border-radius: 22px;
          box-shadow: 0 25px 45px rgba(0,0,0,0.22);
          border: 1px solid rgba(255,255,255,0.13);
          max-width: 580px;
          width: 100%;
          animation: fadeIn 1.2s cubic-bezier(.5,.2,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .status {
          display: inline-block;
          margin-bottom: 1.2rem;
          padding: 0.35rem 1.3rem;
          background: linear-gradient(90deg, #e62245 0%, #b3123a 100%);
          color: #fff;
          border-radius: 50px;
          font-weight: 700;
          letter-spacing: 0.08em;
          font-size: 1.01rem;
          box-shadow: 0 2px 12px rgba(230,34,69,0.14);
        }
        h1 {
          font-size: 2.3rem;
          margin-bottom: 0.6rem;
          background: linear-gradient(90deg, #00dbde 0%, #fc00ff 33%, #e62245 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .subtitle {
          font-size: 1.08rem;
          color: #d9dbe9;
          margin-bottom: 1.9rem;
          font-weight: 400;
        }
        .divider {
          width: 60px;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, #e62245, #fff);
          margin: 0 auto 1.7rem auto;
          animation: slide 2.2s infinite alternate cubic-bezier(.5, .2, .2, 1);
        }
        @keyframes slide { from { width: 40px; } to { width: 60px; } }
        .info {
          font-size: 1rem;
          color: #c2c4e1;
          margin-bottom: 1.2rem;
        }
        .cta-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          margin: 1.8rem 0 0.3rem 0;
        }
        .cta-button {
          display: inline-block;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 1.08rem;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.06em;
          box-shadow: 0 4px 18px rgba(230,34,69,0.15);
          transition: background 0.21s, transform 0.13s;
          position: relative;
          background: linear-gradient(90deg, #e62245 0%, #b3123a 100%);
          color: #fff;
        }
        .cta-button:hover {
          background: linear-gradient(90deg, #b3123a 0%, #e62245 100%);
          transform: scale(1.035);
          color: #fff;
          box-shadow: 0 8px 32px rgba(230,34,69,0.22);
        }
        .footer {
          margin-top: 2.7rem;
          font-size: 0.97rem;
          color: #e62245;
          letter-spacing: 0.13em;
          font-weight: 700;
          text-transform: uppercase;
        }
        @media (max-width: 650px) {
          .container { padding: 2.1rem 0.7rem; }
          h1 { font-size: 1.25rem; }
          .cta-row {gap:0.75rem;}
        }
      </style>
    </head>
    <body>
      <ul class="circles">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li><li></li>
      </ul>
      <div class="container">
        <div class="status">SERVER RUNNING</div>
        <h1>TSGB API Server</h1>
        <div class="subtitle">Welcome to the Official Backend API of <b>TSGB</b></div>
        <div class="divider"></div>
        <div class="info">
          Powering seamless digital experiences with robust RESTful APIs and secure authentication systems.<br>
          <span style="color:#fff;font-weight:600;">API is live &amp; healthy.</span>
        </div>
        <div class="cta-row">
          <a href="https://tsgb.site" class="cta-button" target="_blank" rel="noopener">Discover Our Solutions</a>
        </div>
        <div class="footer">&copy; ${currentYear} TSGB Technologies. All rights reserved.</div>
      </div>
    </body>
    </html>
  `);
});

export default router;
