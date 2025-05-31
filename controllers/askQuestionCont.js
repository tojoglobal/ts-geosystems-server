import db from "../Utils/db.js";

// Submit ask question form
export const submitProductQuestion = async (req, res) => {
  try {
    const { product_id, product_name, name, lastName, email, phone, question } =
      req.body;

    // Basic validation
    if (!product_name || !name || !lastName || !email || !question) {
      return res.status(400).json({
        success: false,
        error:
          "First name, last name, email, question, and product name are required",
      });
    }

    const [result] = await db.query(
      "INSERT INTO product_questions (product_id, product_name, first_name, last_name, email, phone, question) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        product_id || null,
        product_name,
        name,
        lastName,
        email,
        phone || null,
        question,
      ]
    );

    res.json({
      success: true,
      message: "Your question has been submitted successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to submit your question",
    });
  }
};

// Admin: Get all product questions
export const getProductQuestions = async (req, res) => {
  try {
    const [questions] = await db.query(
      "SELECT * FROM product_questions ORDER BY created_at DESC"
    );
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch product questions",
    });
  }
};

// Admin: Delete a product question
export const deleteProductQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM product_questions WHERE id = ?", [id]);
    res.json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete product question",
    });
  }
};
