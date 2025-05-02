import db from "../Utils/db.js";

export const postOrder = async (req, res) => {
  try {
    const {
      order_id,
      email,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingZip,
      shippingPhone,
      shippingComments,
      billingAddress,
      paymentMethod,
      paymentStatus,
      items,
      total,
    } = req.body;

    await db.query(
      `INSERT INTO orders 
      (order_id, email, shipping_name, shipping_address, shipping_city, shipping_zip,
       shipping_phone, shipping_comments, billing_address, payment_method, paymentStatus, items, total) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`,
      [
        order_id,
        email,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingPhone,
        shippingComments,
        billingAddress,
        paymentMethod,
        paymentStatus,
        JSON.stringify(items),
        total,
        "pending",
      ]
    );

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

export const UpdateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  if (!["pending", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    await db.query("UPDATE orders SET status = ? WHERE order_id = ?", [
      status,
      order_id,
    ]);
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
};

export const getOrderData = async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
