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

    // Insert the order into the orders table
    await db.query(
      `INSERT INTO orders 
      (order_id, email, shipping_name, shipping_address, shipping_city, shipping_zip,
       shipping_phone, shipping_comments, billing_address, payment_method, paymentStatus, 
       items, total, status, shipping_cost, payment_info, promo_code) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    // Update the recommended_products table
    for (const item of items) {
      const {
        id: product_id,
        product_name,
        quantity,
        category,
        sub_category,
      } = item;

      // Parse category and sub_category JSON strings
      const parsedCategory = JSON.parse(category);
      const parsedSubCategory = JSON.parse(sub_category);

      const productCategory = parsedCategory.cat;
      const productSubcategory = parsedSubCategory.slug;

      // Check if the product already exists in the recommended_products table
      const [existingProduct] = await db.query(
        "SELECT * FROM recommended_products WHERE product_id = ?",
        [product_id]
      );

      if (existingProduct.length > 0) {
        // If the product exists, update the product count and last ordered time
        await db.query(
          `UPDATE recommended_products 
           SET product_count = product_count + ?, last_ordered_at = NOW() 
           WHERE product_id = ?`,
          [quantity, product_id]
        );
      } else {
        // If the product is new, insert it into the table
        await db.query(
          `INSERT INTO recommended_products 
           (product_id, product_name, product_count, product_category, product_subcategory, last_ordered_at) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [
            product_id,
            product_name,
            quantity,
            productCategory,
            productSubcategory,
          ]
        );
      }
    }

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (err) {
    console.error("Error placing order:", err.message);
    res.status(500).json({ error: "Failed to place order" });
  }
};

export const updatePaymentStaus = async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus } = req.body;

  //✅ Validate payment status
  const validStatuses = ["paid", "unpaid", "pending"];
  if (!validStatuses.includes(paymentStatus)) {
    return res.status(400).json({ message: "Invalid payment status" });
  }

  try {
    // Check if order exists
    const [orderRows] = await db.execute(
      "SELECT * FROM orders WHERE order_id = ?",
      [orderId]
    );
    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update payment status
    await db.query("UPDATE orders SET paymentStatus = ? WHERE order_id = ?", [
      paymentStatus,
      orderId,
    ]);

    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

export const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count of orders for this email
    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM orders WHERE email = ?",
      [email]
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated orders for this email
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [email, limit, offset]
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

export const getUserInboxOrders = async (req, res) => {
  try {
    const { email } = req.params;

    const [orders] = await db.query(
      `SELECT order_id, total, created_at 
       FROM orders 
       WHERE email = ? 
       ORDER BY created_at DESC`,
      [email]
    );

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user inbox orders" });
  }
};

// for user inbox to chat msg to database get post method
// Add a new message from user
export const addUserMessage = async (req, res) => {
  try {
    const { order_id, user_email, subject, message } = req.body;

    // Basic validation
    if (!order_id || !user_email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the order exists (soft check without foreign key)
    const [order] = await db.query(
      "SELECT order_id FROM orders WHERE order_id = ? AND email = ? LIMIT 1",
      [order_id, user_email]
    );

    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found for this user" });
    }

    // Insert the message
    const [result] = await db.query(
      `INSERT INTO user_messages 
       (order_id, user_email, subject, message) 
       VALUES (?, ?, ?, ?)`,
      [order_id, user_email, subject, message]
    );

    res.status(201).json({ 
      message: "Message sent successfully!",
      messageId: result.insertId 
    });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get all messages for admin dashboard
export const getAllMessages = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    // Get total count of messages (with optional search)
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM user_messages
       WHERE order_id LIKE ? OR user_email LIKE ? OR subject LIKE ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated messages with optional order details
    const [messages] = await db.query(
      `SELECT m.*, 
              COALESCE(o.created_at, 'N/A') as order_date,
              COALESCE(o.total, 'N/A') as order_total 
       FROM user_messages m
       LEFT JOIN orders o ON m.order_id = o.order_id
       WHERE m.order_id LIKE ? OR m.user_email LIKE ? OR m.subject LIKE ?
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`, limit, offset]
    );

    res.status(200).json({
      success: true,
      data: messages,
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
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const [message] = await db.query(
      "SELECT id FROM user_messages WHERE id = ? LIMIT 1",
      [id]
    );

    if (message.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Delete the message
    await db.query("DELETE FROM user_messages WHERE id = ?", [id]);

    res.status(200).json({ 
      success: true,
      message: "Message deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

// for dashboard chart
// GET /api/order-metrics?period=year|month|week|today
export const getOrderMetrics = async (req, res) => {
  try {
    const { period = "year" } = req.query;
    let dateCondition = "";
    if (period === "today") {
      dateCondition = "AND DATE(created_at) = CURDATE()";
    } else if (period === "week") {
      dateCondition = "AND YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)";
    } else if (period === "month") {
      dateCondition = "AND YEAR(created_at) = YEAR(NOW()) AND MONTH(created_at) = MONTH(NOW())";
    } else if (period === "year") {
      dateCondition = "AND YEAR(created_at) = YEAR(NOW())";
    }

    // Orders
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE 1=1 ${dateCondition}`
    );
    // Users (if you want to show users added in this period)
    const [users] = await db.query(
      `SELECT * FROM users WHERE 1=1 ${dateCondition}`
    );

    res.json({
      orders,
      users,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
};