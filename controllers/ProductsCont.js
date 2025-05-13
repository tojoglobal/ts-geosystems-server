import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

// Product upload route
export const productAdd = async (req, res) => {
  try {
    const {
      productName,
      price,
      priceShowHide,
      category,
      subCategory,
      tax,
      sku,
      condition,
      productOptions,
      productOptionShowHide,
      softwareOptions,
      brandName,
      productOverview,
      videoUrls,
      warrantyInfo,
      clearance,
    } = req.body;
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    const sql = `INSERT INTO products 
      (product_name, price, priceShowHide, category, sub_category, tax, sku, product_condition, 
       product_options, productOptionShowHide, software_options, brand_name, product_overview, 
       video_urls, warranty_info, image_urls, clearance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; // Fixed missing parenthesis

    const [result] = await db.query(sql, [
      productName,
      price,
      priceShowHide,
      category,
      subCategory,
      tax,
      sku,
      condition,
      productOptions,
      productOptionShowHide,
      softwareOptions,
      brandName,
      productOverview,
      videoUrls,
      warrantyInfo,
      JSON.stringify(imageUrls),
      clearance || false,
    ]);
    res.status(200).json({
      success: true,
      message: "Product saved successfully!",
    });
  } catch (error) {
    console.error("Error in product upload:", error);
    res.status(500).send("Failed to upload product");
  }
};
// get a product
export const getProducts = async (req, res) => {
  try {
    const sql = `SELECT * FROM products`;
    const [products] = await db.query(sql);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// get a delete product
export const deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrls } = req.body;

    // First unlink all images
    if (!imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image URLs provided",
      });
    }
    // Delete images from the filesystem
    for (const imgPath of imageUrls) {
      fs.unlinkSync(path.join(__dirname, "..", "uploads", imgPath));
    }
    const sql = `DELETE FROM products WHERE id = ?`;
    await db.query(sql, [id]);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProducts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET a single brand by ID
export const getproductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete Image
export const deleteImage = async (req, res) => {
  const { imageUrl, id } = req.body;

  try {
    // Step 1: Fetch existing image URLs from the database
    const [existingRows] = await db.query(
      "SELECT image_urls FROM products WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    let existingImageUrls = JSON.parse(existingRows[0].image_urls); // Parse JSON image URLs
    console.log("Existing Image URLs:", existingImageUrls);

    // Step 2: Remove the specified image URL from the array
    const updatedImageUrls = existingImageUrls.filter(
      (url) => url !== imageUrl
    );
    console.log("Updated Image URLs:", updatedImageUrls);

    // Step 3: Delete the file from the filesystem
    const baseName = imageUrl.replace("/uploads/", ""); // Extract base file name
    const imagePath = path.join("uploads", baseName);

    fs.unlink(imagePath, async (err) => {
      if (err) {
        console.error("Failed to delete file:", err);
        return res.status(500).json({ message: "Failed to delete file." });
      }

      // Step 4: Update the database with the new image URLs
      await db.query("UPDATE products SET image_urls = ? WHERE id = ?", [
        JSON.stringify(updatedImageUrls), // Convert array back to JSON for storage
        id,
      ]);

      console.log("Image deleted and database updated successfully.");
      res.json({ message: "Image deleted and product updated successfully." });
    });
  } catch (error) {
    console.error("Error in deleteImage:", error);
    res.status(500).json({ message: "Failed to delete image." });
  }
};

// updatet product
export const updateProductById = async (req, res) => {
  const { id } = req.params;
  const {
    productName,
    price,
    priceShowHide,
    category,
    subCategory,
    tax,
    sku,
    condition,
    productOptions,
    productOptionShowHide,
    softwareOptions,
    brandName,
    productOverview,
    videoUrls,
    warrantyInfo,
    clearance,
  } = req.body;

  try {
    // Fetch existing product to get the old image URLs
    const [existingRows] = await db.query(
      "SELECT image_urls FROM products WHERE id = ?",
      [id]
    );
    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const existingImageUrls = JSON.parse(existingRows[0].image_urls);

    // Update product details
    const sql = `
      UPDATE products 
      SET product_name=?, price=?, priceShowHide=?, category=?, sub_category=?, tax=?, sku=?, 
          product_condition=?, product_options=?, productOptionShowHide=?, software_options=?, 
          brand_name=?, product_overview=?, video_urls=?, warranty_info=?, clearance=?
      WHERE id=?`;

    await db.query(sql, [
      productName,
      price,
      priceShowHide,
      category,
      subCategory,
      tax,
      sku,
      condition,
      productOptions,
      productOptionShowHide,
      softwareOptions,
      brandName,
      productOverview,
      videoUrls,
      warrantyInfo,
      clearance || false,
      id, // Moved to the end as it's the WHERE clause parameter
    ]);

    // Handle new images if provided
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map((file) => `/uploads/${file.filename}`);
      const allImageUrls = [...existingImageUrls, ...newImageUrls];

      // Update the image URLs in the database
      await db.query("UPDATE products SET image_urls=? WHERE id=?", [
        JSON.stringify(allImageUrls),
        id,
      ]);
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
    });
  } catch (error) {
    console.error("Error in updateProductById:", error);
    res.status(500).send("Failed to update product");
  }
};

// get product by id Query
export const getProductByIdQuery = async (req, res) => {
  const { ids } = req.query;
  if (!ids) {
    return res.status(400).json({ error: "Missing 'ids' query parameter" });
  }

  // Split and clean the ids
  const idArray = ids
    .split(",")
    .map((id) => parseInt(id.trim()))
    .filter(Boolean);

  if (idArray.length === 0) {
    return res.status(400).json({ error: "No valid product IDs provided" });
  }

  try {
    const placeholders = idArray.map(() => "?").join(", ");
    const [rows] = await db.execute(
      `SELECT * FROM products WHERE id IN (${placeholders})`,
      idArray
    );

    res.json({ products: rows });
  } catch (err) {
    console.error("Error fetching products by IDs:", err);
    res.status(500).json({ error: "Server error while fetching products" });
  }
};
