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
      condition,
      sku,
      productOptions,
      productOptionShowHide,
      softwareOptions,
      brandName,
      productOverview,
      videoUrls,
      warrantyInfo,
      clearance,
      isStock,
      flashSale,
      flashSaleEnd,
      sale,
      metaKeywords,
      metaDescription,
    } = req.body;
    
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    
    const sql = `INSERT INTO products 
      (product_name, price, priceShowHide, category, sub_category, tax, sku, product_condition, 
       product_options, productOptionShowHide, software_options, brand_name, product_overview, 
       video_urls, warranty_info, image_urls, clearance, isStock, sale, flash_sale, flash_sale_end,
       meta_keywords, meta_description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
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
      isStock !== undefined ? isStock : true,
      sale !== undefined ? sale : false,
      flashSale ? 1 : 0,
      flashSaleEnd ? new Date(flashSaleEnd) : null,
      metaKeywords || "",
      metaDescription || "",
    ]);
    
    res.status(200).json({
      success: true,
      message: "Product saved successfully!",
    });
  } catch (error) {
    console.error("Product add error:", error);
    res.status(500).send("Failed to upload product");
  }
};

// Updated updateProductById function with meta fields
export const updateProductById = async (req, res) => {
  const { id } = req.params;
  const {
    productName,
    price,
    priceShowHide,
    category,
    subCategory,
    condition,
    tax,
    sku,
    productOptions,
    productOptionShowHide,
    softwareOptions,
    brandName,
    productOverview,
    videoUrls,
    warrantyInfo,
    clearance,
    isStock,
    sale,
    flashSale,
    flashSaleEnd,
    metaKeywords,
    metaDescription,
  } = req.body;

  try {
    // Convert string values to proper boolean values
    const clearanceBool =
      clearance === "1" || clearance === "true" || clearance === true;
    const isStockBool =
      isStock === "1" || isStock === "true" || isStock === true;
    const saleBool = sale === "1" || sale === "true" || sale === true;
    const flashSaleBool =
      flashSale === "1" || flashSale === "true" || flashSale === true;

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
        brand_name=?, product_overview=?, video_urls=?, warranty_info=?, clearance=?,
        isStock=?, sale=?, flash_sale=?, flash_sale_end=?, meta_keywords=?, meta_description=?
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
      clearanceBool ? 1 : 0,
      isStockBool ? 1 : 0,
      saleBool ? 1 : 0,
      flashSaleBool ? 1 : 0,
      flashSaleEnd ? new Date(flashSaleEnd) : null,
      metaKeywords || "",
      metaDescription || "",
      id,
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

    res.status(201).json({
      success: true,
      message: "Product updated successfully!",
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send("Failed to update product");
  }
};

// for only product table
// New paginated, search-enabled product table endpoint
export const getProductTable = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    let countQuery = "SELECT COUNT(*) AS total FROM products";
    let dataQuery = "SELECT * FROM products";
    const params = [];
    const countParams = [];

    // Only search by product_name
    if (search && search.trim() !== "") {
      countQuery += " WHERE product_name LIKE ?";
      dataQuery += " WHERE product_name LIKE ?";
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    dataQuery += " ORDER BY id DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Execute queries
    const [products] = await db.query(dataQuery, params);
    const [[countResult]] = await db.query(
      countQuery,
      countParams.length ? countParams : undefined
    );

    res.status(200).json({
      success: true,
      products,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("getProductTable error:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get a delete product
export const deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. First get the product to find its image URLs
    const [product] = await db.query(
      "SELECT image_urls FROM products WHERE id = ?",
      [id]
    );

    if (!product.length) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const imageUrls = JSON.parse(product[0].image_urls);

    // 2. Delete the product from database
    await db.query("DELETE FROM products WHERE id = ?", [id]);

    // 3. Delete associated images
    if (Array.isArray(imageUrls)) {
      imageUrls.forEach((imgPath) => {
        try {
          const filename = imgPath.split("/uploads/").pop();
          if (filename) {
            const fullPath = path.join(process.cwd(), "uploads", filename);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
              // console.log(`Deleted file: ${filename}`);
            }
          }
        } catch (err) {
          console.error(`Error deleting file ${imgPath}:`, err);
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Product and images deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
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

    // Step 2: Remove the specified image URL from the array
    const updatedImageUrls = existingImageUrls.filter(
      (url) => url !== imageUrl
    );

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

      res.json({ message: "Image deleted and product updated successfully." });
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image." });
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
    res.status(500).json({ error: "Server error while fetching products" });
  }
};

// Get products by category/subcategory
export const getProductsByCategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || "newest";

    // Base SQL query
    let baseQuery = `
      SELECT * FROM products 
      WHERE JSON_EXTRACT(category, '$.cat') = ?
    `;
    let countQuery = `
      SELECT COUNT(*) AS total FROM products 
      WHERE JSON_EXTRACT(category, '$.cat') = ?
    `;
    const queryParams = [category];
    const countParams = [category];

    // Apply subcategory filtering if not 'shop-all'
    if (subcategory && subcategory !== "shop-all") {
      baseQuery += " AND JSON_EXTRACT(sub_category, '$.slug') = ?";
      countQuery += " AND JSON_EXTRACT(sub_category, '$.slug') = ?";
      queryParams.push(subcategory);
      countParams.push(subcategory);
    }

    // Add sorting - removed 'featured' since the column doesn't exist
    switch (sortBy) {
      case "newest":
        baseQuery += " ORDER BY id DESC"; // Using id DESC as proxy for newest
        break;
      case "price_asc":
        baseQuery += " ORDER BY CAST(price AS DECIMAL(10,2)) ASC";
        break;
      case "price_desc":
        baseQuery += " ORDER BY CAST(price AS DECIMAL(10,2)) DESC";
        break;
      case "name_asc":
        baseQuery += " ORDER BY product_name ASC";
        break;
      case "name_desc":
        baseQuery += " ORDER BY product_name DESC";
        break;
      case "best_selling":
        // Fallback to newest if best selling logic not implemented
        baseQuery += " ORDER BY id DESC";
        break;
      case "by_review":
        // Fallback to newest if review logic not implemented
        baseQuery += " ORDER BY id DESC";
        break;
      default:
        baseQuery += " ORDER BY id DESC"; // Default to newest
    }

    // Add pagination to the main query
    baseQuery += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    // Execute queries
    const [products] = await db.query(baseQuery, queryParams);
    const [[countResult]] = await db.query(countQuery, countParams);

    res.status(200).json({
      success: true,
      products,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Get clearance products
export const getClearanceProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db.query(
      "SELECT COUNT(*) AS total FROM products WHERE clearance = 1"
    );

    // Get paginated products
    const [products] = await db.query(
      "SELECT * FROM products WHERE clearance = 1 LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.status(200).json({
      success: true,
      products,
      total: countResult[0].total,
      totalPages: Math.ceil(countResult[0].total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST: add or update a search term
export const postPopularSearch = async (req, res) => {
  try {
    const { term } = req.body;
    if (!term || typeof term !== "string" || !term.trim()) {
      return res.status(400).json({ error: "Invalid search term." });
    }
    const cleanTerm = term.trim().toLowerCase();

    // Insert or update count
    await db.query(
      "INSERT INTO popular_searches (term, count) VALUES (?, 1) ON DUPLICATE KEY UPDATE count = count + 1, last_searched = CURRENT_TIMESTAMP",
      [cleanTerm]
    );

    res.json({ success: true, message: "Search term tracked.", term: cleanTerm });
  } catch (error) {
    console.error("postPopularSearch error:", error);
    res.status(500).json({ error: "Server error saving popular search" });
  }
};
// Get top N popular searches
export const getPopularSearches = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await db.query(
      "SELECT term FROM popular_searches ORDER BY count DESC, last_searched DESC LIMIT ?",
      [limit]
    );
    res.json({ searches: rows.map((row) => row.term) });
  } catch (error) {
    res.status(500).json({ error: "Error fetching popular searches" });
  }
};

// Search products with filters
export const searchProducts = async (req, res) => {
  try {
    const { query, sort = "relevance", page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    let sqlQuery = `
      SELECT * FROM products 
      WHERE product_name LIKE ? 
      OR JSON_EXTRACT(category, '$.cat') LIKE ? 
      OR brand_name LIKE ?`;

    let countQuery = `
      SELECT COUNT(*) as total FROM products 
      WHERE product_name LIKE ? 
      OR JSON_EXTRACT(category, '$.cat') LIKE ? 
      OR brand_name LIKE ?`;

    const searchTerm = `%${query}%`;
    const queryParams = [searchTerm, searchTerm, searchTerm];

    // Add sorting
    switch (sort) {
      case "price_asc":
        sqlQuery += " ORDER BY CAST(price AS DECIMAL(10,2)) ASC";
        break;
      case "price_desc":
        sqlQuery += " ORDER BY CAST(price AS DECIMAL(10,2)) DESC";
        break;
      case "name_asc":
        sqlQuery += " ORDER BY product_name ASC";
        break;
      default: // relevance - could be enhanced with full-text search
        sqlQuery += " ORDER BY product_name ASC";
    }

    // Add pagination
    sqlQuery += " LIMIT ? OFFSET ?";
    queryParams.push(parseInt(limit), offset);

    // Execute queries
    const [products] = await db.query(sqlQuery, queryParams);
    const [[countResult]] = await db.query(countQuery, [
      searchTerm,
      searchTerm,
      searchTerm,
    ]);

    res.status(200).json({
      success: true,
      products,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// In your searchProducts controller
export const searchProductsMobile = async (req, res) => {
  try {
    const { query, sort = "relevance", page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    // Modified to only search product_name
    let sqlQuery = `
      SELECT * FROM products 
      WHERE product_name LIKE ? 
      ORDER BY product_name ASC
      LIMIT ? OFFSET ?`;

    let countQuery = `
      SELECT COUNT(*) as total FROM products 
      WHERE product_name LIKE ?`;

    const searchTerm = `%${query}%`;

    // Execute queries
    const [products] = await db.query(sqlQuery, [
      searchTerm,
      parseInt(limit),
      offset,
    ]);
    const [[countResult]] = await db.query(countQuery, [searchTerm]);

    res.status(200).json({
      success: true,
      products,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductsForShopAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || "newest";

    let baseQuery = "SELECT * FROM products";
    let countQuery = "SELECT COUNT(*) AS total FROM products";

    // Add sorting
    switch (sortBy) {
      case "newest":
        baseQuery += " ORDER BY id DESC";
        break;
      case "price_asc":
        baseQuery += " ORDER BY CAST(price AS DECIMAL(10,2)) ASC";
        break;
      case "price_desc":
        baseQuery += " ORDER BY CAST(price AS DECIMAL(10,2)) DESC";
        break;
      case "name_asc":
        baseQuery += " ORDER BY product_name ASC";
        break;
      case "name_desc":
        baseQuery += " ORDER BY product_name DESC";
        break;
      default:
        baseQuery += " ORDER BY id DESC";
    }

    // Add pagination
    baseQuery += " LIMIT ? OFFSET ?";
    const queryParams = [limit, offset];

    // Execute queries
    const [products] = await db.query(baseQuery, queryParams);
    const [[countResult]] = await db.query(countQuery);

    res.status(200).json({
      success: true,
      products,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Track product view
export const trackProductView = async (req, res) => {
  try {
    const { productId, userEmail } = req.body;
    // Check if the product exists
    const [product] = await db.query("SELECT id FROM products WHERE id = ?", [
      productId,
    ]);
    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Insert or update view count
    const sql = `
      INSERT INTO product_views (product_id, user_email, view_count) 
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE 
        view_count = view_count + 1,
        last_viewed = CURRENT_TIMESTAMP
    `;

    await db.query(sql, [productId, userEmail]);

    res.status(200).json({ success: true, message: "View tracked" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error tracking view",
      error: error.message,
    });
  }
};

// Get viewed products by user
export const getViewedProducts = async (req, res) => {
  try {
    const { email } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    // Count total viewed products
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total 
       FROM product_views 
       WHERE user_email = ?`,
      [email]
    );

    // Get paginated viewed products
    const sql = `
      SELECT 
        pv.id as view_id,
        pv.view_count,
        pv.last_viewed,
        p.* 
      FROM products p
      JOIN product_views pv ON p.id = pv.product_id
      WHERE pv.user_email = ?
      ORDER BY pv.last_viewed DESC
      LIMIT ? OFFSET ?
    `;

    const [products] = await db.query(sql, [email, limit, offset]);

    // Format the response
    const formattedProducts = products.map((product) => {
      const { view_id, view_count, last_viewed, ...productData } = product;
      return {
        ...productData,
        view_info: {
          view_id,
          view_count,
          last_viewed,
        },
      };
    });

    res.status(200).json({
      success: true,
      products: formattedProducts,
      total: countResult[0].total,
      totalPages: Math.ceil(countResult[0].total / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching viewed products",
      error: error.message,
    });
  }
};

// export const getRecommendedProducts = async (req, res) => {
//   try {
//     const [products] = await db.query(
//       `SELECT * FROM recommended_products ORDER BY product_count DESC, last_ordered_at DESC LIMIT 10`
//     );

//     res.status(200).json({ recommendedProducts: products });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch recommended products" });
//   }
// };

export const getRecommendedProducts = async (req, res) => {
  try {
    // 1. Get up to 10 recommended product IDs, most recent/popular first
    const [recommendedRows] = await db.query(
      `SELECT product_id FROM recommended_products 
       ORDER BY product_count DESC, last_ordered_at DESC 
       LIMIT 10`
    );
    const recommendedIds = recommendedRows.map((row) => row.product_id);

    let products = [];

    if (recommendedIds.length > 0) {
      // 2. Get those products by ID (maintain order)
      const placeholders = recommendedIds.map(() => "?").join(",");
      const [recommendedProducts] = await db.query(
        `SELECT * FROM products WHERE id IN (${placeholders}) 
         ORDER BY FIELD(id, ${placeholders})`,
        [...recommendedIds, ...recommendedIds]
      );
      products = recommendedProducts;
    }

    // 3. If less than 10, fill up with latest (excluding already included)
    if (products.length < 10) {
      const excludeIds = products.map((p) => p.id);
      let sql = `SELECT * FROM products `;
      let params = [];
      if (excludeIds.length) {
        sql += `WHERE id NOT IN (${excludeIds.map(() => "?").join(",")}) `;
        params = excludeIds;
      }
      sql += `ORDER BY id DESC LIMIT ?`;
      params.push(10 - products.length);

      const [moreProducts] = await db.query(sql, params);
      products = [...products, ...moreProducts];
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error in getRecommendedProducts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommended products",
      error: error.message,
    });
  }
};

// Homepage Get products for highlights section (featured, top sellers, new products)
export const getProductHighlights = async (req, res) => {
  try {
    // Get all products first
    const [allProducts] = await db.query("SELECT * FROM products");

    // Get recommended products for top sellers
    const [recommendedProducts] = await db.query(
      "SELECT * FROM recommended_products ORDER BY product_count DESC, last_ordered_at DESC"
    );

    // Featured Products - Old to new (ascending by ID)
    const featuredProducts = [...allProducts]
      .sort((a, b) => a.id - b.id)
      .slice(0, 10); // Get first 10 oldest products

    // Top Sellers - Match recommended products with main products
    const topSellerIds = recommendedProducts.map((p) => p.product_id);
    const topSellers = allProducts
      .filter((product) => topSellerIds.includes(product.id))
      .slice(0, 10); // Limit to 10 products

    // New Products - New to old (descending by ID)
    const newProducts = [...allProducts]
      .sort((a, b) => b.id - a.id)
      .slice(0, 10); // Get first 10 newest products

    res.status(200).json({
      success: true,
      data: {
        featured: featuredProducts,
        top: topSellers,
        new: newProducts,
      },
    });
  } catch (error) {
    console.error("Error in getProductHighlights:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product highlights",
      error: error.message,
    });
  }
};

// Get products by brand slug (case-insensitive)
export const getProductsByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || "newest";

    let baseQuery = `
      SELECT * FROM products 
      WHERE LOWER(brand_name) = ?
    `;
    let countQuery = `
      SELECT COUNT(*) AS total FROM products 
      WHERE LOWER(brand_name) = ?
    `;
    const queryParams = [brand.toLowerCase()];
    const countParams = [brand.toLowerCase()];

    // Add sorting
    switch (sortBy) {
      case "newest":
        baseQuery += " ORDER BY id DESC";
        break;
      case "price_asc":
        baseQuery += " ORDER BY CAST(price AS DECIMAL(10,2)) ASC";
        break;
      case "price_desc":
        baseQuery += " ORDER BY CAST(price AS DECIMAL(10,2)) DESC";
        break;
      case "name_asc":
        baseQuery += " ORDER BY product_name ASC";
        break;
      case "name_desc":
        baseQuery += " ORDER BY product_name DESC";
        break;
      default:
        baseQuery += " ORDER BY id DESC";
    }

    // Pagination
    baseQuery += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    // Execute
    const [products] = await db.query(baseQuery, queryParams);
    const [[countResult]] = await db.query(countQuery, countParams);

    res.status(200).json({
      success: true,
      products,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("getProductsByBrand error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
