import db from "../Utils/db.js";

// Product upload route
const productAdd = async (req, res) => {
  console.log(req.body);
  try {
    const {
      productName,
      category,
      subCategory,
      sku,
      condition,
      productOptions,
      softwareOptions,
      brandName,
      productOverview,
      videoUrls,
      warrantyInfo,
    } = req.body;

    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    const sql = `
            INSERT INTO products 
            (product_name, category, sub_category, sku, product_condition, product_options, software_options, brand_name, product_overview, video_urls, warranty_info, image_urls)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      productName,
      category,
      subCategory,
      sku,
      condition,
      productOptions,
      softwareOptions,
      brandName,
      productOverview,
      videoUrls,
      warrantyInfo,
      JSON.stringify(imageUrls),
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

export { productAdd };
