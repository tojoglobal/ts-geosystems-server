import express from "express";
import SSLCommerzPayment from "sslcommerz-lts";
import dotenv from "dotenv";
import db from "../Utils/db.js";
import sendEmail from "../Utils/sendEmail.js";
dotenv.config();

const SSLCommerzPaymentRoute = express.Router();
const store_id = process.env.store_id;
const store_passwd = process.env.store_passwd;
const is_live = false;
const redirect_url = process.env.FRONT_END_ORIGIN_URL;

// Init payment
SSLCommerzPaymentRoute.post("/ssl-payment/init", async (req, res) => {
  const {
    total_amount,
    order_id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    shipping_city,
    shipping_zip,
  } = req.body;

  const data = {
    total_amount,
    currency: "BDT",
    tran_id: order_id,
    success_url: `${process.env.BACKEND_URL}/api/payment/ssl-payment/success/${order_id}`,
    fail_url: `${process.env.BACKEND_URL}/api/payment/ssl-payment/fail`,
    cancel_url: `${process.env.BACKEND_URL}/api/payment/ssl-payment/cancel`,
    ipn_url: `${process.env.BACKEND_URL}/api/payment/ssl-payment/ipn`,
    shipping_method: "Courier",
    product_name: "E-commerce Order",
    product_category: "General",
    product_profile: "general",
    cus_name: customer_name,
    cus_email: customer_email,
    cus_add1: shipping_address,
    cus_city: shipping_city,
    cus_postcode: shipping_zip,
    cus_country: "Bangladesh",
    cus_phone: customer_phone,
    ship_name: customer_name,
    ship_add1: shipping_address,
    ship_city: shipping_city,
    ship_postcode: shipping_zip,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    res.json({ GatewayPageURL: apiResponse.GatewayPageURL });
  });
});

// Success Route
SSLCommerzPaymentRoute.post(
  "/ssl-payment/success/:orderId",
  async (req, res) => {
    const { tran_id, val_id, amount, card_type, status } = req.body;

    try {
      // Update payment info
      await db.query(
        `UPDATE orders SET payment_status = ?, payment_info = ? WHERE order_id = ?`,
        ["paid", JSON.stringify({ val_id, amount, card_type, status }), tran_id]
      );

      // Get order details to email
      const [orderResult] = await db.query(
        `SELECT * FROM orders WHERE order_id = ?`,
        [tran_id]
      );

      if (orderResult.length > 0) {
        const order = orderResult[0];
        // Send thank-you email
        await sendEmail({
          to: order.customer_email,
          subject: "Thank you for your order!",
          html: `
          <h2>Hi ${order.customer_name},</h2>
          <p>Thank you for your order <strong>${tran_id}</strong>.</p>
          <p><strong>Total:</strong> ${order.total_amount} BDT</p>
          <p>We’ll notify you when your items ship.</p>
          <br />
          <p>Best regards,<br/>Your Shop Team</p>
        `,
        });
      }

      res.redirect(`${redirect_url}/thank-you?order_id=${tran_id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Payment Success Handling Failed");
    }
  }
);

// Fail Route
SSLCommerzPaymentRoute.post("/ssl-payment/fail", async (req, res) => {
  const { tran_id } = req.body;

  try {
    // Delete failed order
    await db.query(`DELETE FROM orders WHERE order_id = ?`, [tran_id]);
    res.redirect(`${redirect_url}/payment-failed`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting failed order");
  }
});

// Cancel Route
SSLCommerzPaymentRoute.post("/ssl-payment/cancel", async (req, res) => {
  const { tran_id } = req.body;

  try {
    // Delete cancelled order
    await db.query(`DELETE FROM orders WHERE order_id = ?`, [tran_id]);
    res.redirect(`${redirect_url}/payment-cancelled`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting cancelled order");
  }
});

// IPN Route
SSLCommerzPaymentRoute.post("/ssl-payment/ipn", async (req, res) => {
  const { status, tran_id } = req.body;

  let paymentStatus = "unpaid";
  let orderStatus = "pending";

  if (status === "VALID") {
    paymentStatus = "paid";
  } else if (status === "FAILED") {
    paymentStatus = "failed";
    orderStatus = "cancelled";
  }

  try {
    await db.query(
      "UPDATE orders SET payment_status = ?, status = ? WHERE order_id = ?",
      [paymentStatus, orderStatus, tran_id]
    );
    res.status(200).send("IPN received");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing IPN");
  }
});

// Fetch order details by ID
SSLCommerzPaymentRoute.get("/orderdata/:order_id", async (req, res) => {
  try {
    const { order_id } = req.params;
    const [order] = await db.query("SELECT * FROM orders WHERE order_id = ?", [
      order_id,
    ]);

    if (!order || order.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order data" });
  }
});

export default SSLCommerzPaymentRoute;
