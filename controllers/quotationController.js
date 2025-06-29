import db from "../Utils/db.js";
import sendEmail from "../Utils/sendEmail.js";

// Premium, branded HTML email
function getThankYouEmail({ firstName, product_name, product_price }) {
  return `
  <div style="background:linear-gradient(135deg,#faf6ff 0%,#f9faff 100%);padding:0;margin:0;font-family: 'Segoe UI',Roboto,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ff;padding:0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fff;border-radius:18px;box-shadow:0 4px 32px #c084fc1a;margin:32px 16px;">
            <tr>
              <td align="center" style="padding:32px;">
                <img src="https://cdn.jsdelivr.net/gh/swapnilahmedshishir/assets/docstamp-premium.png" alt="Premium Quotation" width="82" style="margin-bottom:18px;border-radius:14px;">
                <h1 style="color:#7F56D9;font-size:2.1em;margin-bottom:12px;">Thank You for Your Quotation Request!</h1>
                <p style="font-size:17px;color:#555;margin-bottom:22px;">
                  Hi <b>${firstName}</b>,<br>
                  We’ve received your request for <b style="color:#e62245;">${product_name}</b>.<br>
                  Estimated price: <span style="color:#7F56D9;font-weight:600;">৳${parseFloat(
                    product_price
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}</span>
                </p>
                <p style="font-size:16px;color:#333;margin-bottom:24px;">
                  A premium advisor will review your request and contact you soon.<br>
                  For urgent queries, reach us at <a href="mailto:support@yourbrand.com" style="color:#7F56D9;">support@yourbrand.com</a>
                </p>
                <a href="https://yourbrand.com" style="display:inline-block;padding:14px 35px;border-radius:10px;background:linear-gradient(90deg,#7F56D9,#F472B6);color:#fff;font-size:17px;font-weight:600;text-decoration:none;box-shadow:0 2px 12px #d1aaff40;">
                  Visit Our Website &rarr;
                </a>
                <p style="margin-top:30px;color:#a21caf;font-size:15px;">
                  Thank you for choosing <b>YourBrand</b>.<br>
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:14px 0 0 0;font-size:13px;color:#bbb">
                &copy; ${new Date().getFullYear()} YourBrand &mdash; Premium Service.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}

export const createQuotation = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    message,
    product_id,
    product_name,
    product_price,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !product_id ||
    !product_name ||
    !product_price
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }
  try {
    const [result] = await db.execute(
      `INSERT INTO quotation_requests
      (first_name, last_name, email, phone, message, product_id, product_name, product_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        phone,
        message,
        product_id,
        product_name,
        product_price,
      ]
    );
    // Send thank-you email
    await sendEmail({
      to: email,
      subject: "Thank you for your quotation request!",
      html: getThankYouEmail({ firstName, product_name, product_price }),
    });
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Quotation POST error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getQuotations = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM quotation_requests ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Quotation GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "DELETE FROM quotation_requests WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Quotation request not found." });
    }
    res
      .status(200)
      .json({ message: "Quotation request deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};