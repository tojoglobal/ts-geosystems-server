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
      shipping_cost,
      total,
    } = req.body;

    await db.query(
      `INSERT INTO orders 
  (order_id, email, shipping_name, shipping_address, shipping_city, shipping_zip,
   shipping_phone, shipping_comments, billing_address, payment_method, paymentStatus, 
   items, total, status, shipping_cost, payment_info, promo_code) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // ✅ 17 placeholders
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
        shipping_cost,
        null,
        coupon || null,
      ]
    );

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (err) {
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
    res.status(500).json({ error: "Failed to update status" });
  }
};

export const getOrderData = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count of orders
    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM orders"
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated orders
    const [orders] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
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
    res.status(500).json({ error: "Failed to fetch latest orders" });
  }
};
