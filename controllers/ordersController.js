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
      coupon,
      total,
    } = req.body;

    await db.query(
      `INSERT INTO orders 
  (order_id, email, shipping_name, shipping_address, shipping_city, shipping_zip,
   shipping_phone, shipping_comments, billing_address, payment_method, paymentStatus, 
   items, total, status, payment_info, promo_code) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // ✅ 16 placeholders
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
        null,
        coupon || null,
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

  // ✅ Include "shipping" as valid status
  const validStatuses = ["pending", "completed", "cancelled", "shipping"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    await db.query("UPDATE orders SET status = ? WHERE order_id = ?", [
      status,
      order_id,
    ]);
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};

export const getOrderData = async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    res
      .status(200)
      .json({ message: true, totalOrder: orders?.length, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const deleteOrder = async (req, res) => {
  const { order_id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM orders WHERE order_id = ?", [
      order_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
};


export const getLatestOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT 6"
    );
    res.status(200).json({ message: true, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch latest orders" });
  }
};