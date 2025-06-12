// import express from "express";
// import SSLCommerzPayment from "sslcommerz-lts";
// import dotenv from "dotenv";
// import db from "../Utils/db.js";
// import sendEmail from "../Utils/sendEmail.js";
// dotenv.config();

// const SSLCommerzPaymentRoute = express.Router();
// const store_id = process.env.store_id;
// const store_passwd = process.env.store_passwd;
// const is_live = false;
// const redirect_url = process.env.FRONT_END_ORIGIN_URL;

// // Init payment
// SSLCommerzPaymentRoute.post("/ssl-payment/init", async (req, res) => {
//   const {
//     total_amount,
//     productIds,
//     shippingCost,
//     order_id,
//     customer_name,
//     customer_email,
//     customer_phone,
//     shipping_address,
//     shipping_city,
//     shipping_zip,
//     items,
//     coupon,
//   } = req.body;

//   try {
//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Items are required." });
//     }
//     // Fetch product details
//     const productIdsArray = items.map((item) => item.id);
//     const [products] = await db.query(
//       `SELECT id, price, tax FROM products WHERE id IN (?)`,
//       [productIdsArray]
//     );

//     if (products.length !== items.length) {
//       return res.status(400).json({ message: "Some products are missing" });
//     }

//     // Calculate subtotal, VAT, and total
//     let subtotal = 0;
//     let vat = 0;

//     items.forEach((item) => {
//       const product = products.find((p) => p.id === item.id);
//       if (!product) {
//         return res
//           .status(400)
//           .json({ message: `Product with ID ${item.id} not found.` });
//       }

//       const ProductPrice = product.price;
//       const price = Number(ProductPrice.toString().replace(/,/g, ""));
//       let taxObj = product.tax;

//       if (typeof taxObj === "string") {
//         try {
//           taxObj = JSON.parse(taxObj);
//         } catch (e) {
//           return res.status(400).json({ message: "Invalid tax JSON format" });
//         }
//       }

//       let taxRate = 0;
//       if (taxObj && typeof taxObj === "object" && "value" in taxObj) {
//         const rawValue = taxObj.value;
//         taxRate = parseFloat(rawValue);
//         if (isNaN(taxRate)) {
//           return res.status(400).json({
//             message: `Invalid tax rate for product ${product.id || item.id}`,
//           });
//         }
//       }

//       const quantity = item.quantity;
//       const itemSubtotal = price * quantity;
//       const itemVat = price * taxRate * quantity;

//       subtotal += itemSubtotal;
//       vat += itemVat;
//     });

//     //✅ Handle discount if any
//     let discount = 0;
//     if (coupon && coupon.code_name) {
//       const [promo] = await db.query(
//         `SELECT * FROM promo_codes WHERE code_name = ?`,
//         [coupon.code_name]
//       );

//       if (promo.length > 0) {
//         const { type, discount: promoDiscount } = promo[0];
//         if (type === "percentage") {
//           discount = (subtotal * promoDiscount) / 100;
//         } else if (type === "flat") {
//           discount = promoDiscount;
//         }
//       }
//     }

//     // Calculate total
//     const total = subtotal + vat + shippingCost - discount;

//     // ✅ Check total match
//     if (Math.abs(total - total_amount) > 1) {
//       return res.status(400).json({
//         message: "Total amount mismatch. Please refresh and try again.",
//         calculatedTotal: total,
//         clientTotal: total_amount,
//       });
//     }

//     // ✅ Proceed with payment
//     const data = {
//       total_amount,
//       currency: "BDT",
//       tran_id: order_id,
//       success_url: `${process.env.BACKEND_URL}/api/ssl-payment/success`,
//       fail_url: `${process.env.BACKEND_URL}/api/ssl-payment/fail`,
//       cancel_url: `${process.env.BACKEND_URL}/api/payment/ssl-payment/cancel`,
//       ipn_url: `${process.env.BACKEND_URL}/api/payment/ssl-payment/ipn`,
//       shipping_method: "Courier",
//       product_name: "E-commerce Order",
//       product_category: "General",
//       product_profile: "general",
//       cus_name: customer_name,
//       cus_email: customer_email,
//       cus_add1: shipping_address,
//       cus_city: shipping_city,
//       cus_postcode: shipping_zip,
//       cus_country: "Bangladesh",
//       cus_phone: customer_phone,
//       ship_name: customer_name,
//       ship_add1: shipping_address,
//       ship_city: shipping_city,
//       ship_postcode: shipping_zip,
//       ship_country: "Bangladesh",
//     };

//     const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
//     sslcz.init(data).then((apiResponse) => {
//       res.json({ GatewayPageURL: apiResponse.GatewayPageURL });
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error initializing payment", error: err.message });
//   }
// });

// // Success Route
// SSLCommerzPaymentRoute.post("/ssl-payment/success", async (req, res) => {
//   const { tran_id, val_id, amount, card_type, status } = req.body;

//   try {
//     // Update payment info
//     await db.query(
//       `UPDATE orders SET paymentStatus = ?, payment_info = ? WHERE order_id = ?`,
//       ["paid", JSON.stringify({ val_id, amount, card_type, status }), tran_id]
//     );

//     // Get order details to email
//     const [orderResult] = await db.query(
//       `SELECT * FROM orders WHERE order_id = ?`,
//       [tran_id]
//     );

//     if (orderResult.length > 0) {
//       const order = orderResult[0];
//       if (order.promo_code) {
//         // Update promo_code uses_time
//         await db.query(
//           `UPDATE promo_codes SET uses_time = uses_time + 1 WHERE code_name = ?`,
//           [order.promo_code]
//         );

//         // Insert into promo_order_usage
//         await db.query(
//           `INSERT INTO promo_order_usage (order_transaction_id, promo_code) VALUES (?, ?)`,
//           [tran_id, order.promo_code]
//         );
//       }
//       // Send thank-you email
//       await sendEmail({
//         to: order?.email,
//         subject: "Thank you for your order!",
//         html: `
//           <h2>Hi ${order?.shipping_name},</h2>
//           <p>Thank you for your order <strong>${tran_id}</strong>.</p>
//           <p><strong>Total:</strong> ${order?.total} BDT</p>
//           <p>We’ll notify you when your items ship.</p>
//           <br />
//           <p>Best regards,<br/>Your Shop Team</p>
//         `,
//       });
//     }

//     res.redirect(`${redirect_url}/thank-you?order_id=${tran_id}`);
//   } catch (err) {
//     res.status(500).send("Payment Success Handling Failed");
//   }
// });

// // Fail Route
// SSLCommerzPaymentRoute.post("/ssl-payment/fail", async (req, res) => {
//   const { tran_id } = req.body;
//   try {
//     // Delete failed order
//     await db.query(`DELETE FROM orders WHERE order_id = ?`, [tran_id]);
//     res.redirect(`${redirect_url}/payment-failed`);
//   } catch (err) {
//     res.status(500).send("Error deleting failed order");
//   }
// });

// // Cancel Route
// SSLCommerzPaymentRoute.post("/payment/ssl-payment/cancel", async (req, res) => {
//   const { tran_id } = req.body;

//   try {
//     // Delete cancelled order
//     await db.query(`DELETE FROM orders WHERE order_id = ?`, [tran_id]);
//     res.redirect(`${redirect_url}/payment-cancelled`);
//   } catch (err) {
//     res.status(500).send("Error deleting cancelled order");
//   }
// });

// // IPN Route
// SSLCommerzPaymentRoute.post("/payment/ssl-payment/ipn", async (req, res) => {
//   const { status, tran_id } = req.body;

//   let paymentStatus = "unpaid";
//   let orderStatus = "pending";

//   if (status === "VALID") {
//     paymentStatus = "paid";
//   } else if (status === "FAILED") {
//     paymentStatus = "failed";
//     orderStatus = "cancelled";
//   }

//   try {
//     await db.query(
//       "UPDATE orders SET payment_status = ?, status = ? WHERE order_id = ?",
//       [paymentStatus, orderStatus, tran_id]
//     );
//     res.status(200).send("IPN received");
//   } catch (err) {
//     res.status(500).send("Error processing IPN");
//   }
// });

// // Fetch order details by ID
// SSLCommerzPaymentRoute.get("/orderdata", async (req, res) => {
//   try {
//     const { orderId } = req.query;

//     const [order] = await db.query("SELECT * FROM orders WHERE order_id = ?", [
//       orderId,
//     ]);

//     if (!order || order.length === 0) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json(order[0]);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch order data" });
//   }
// });

// export default SSLCommerzPaymentRoute;
