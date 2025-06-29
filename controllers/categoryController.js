import db from "../Utils/db.js";
import fs from "fs";
import path from "path";

export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const [subCountRows] = await db.query(
      "SELECT COUNT(*) AS count FROM subcategories WHERE main_category_id = ?",
      [categoryId]
    );
    if (subCountRows[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category: It has subcategories under it.",
      });
    }

    // 2. Get the photo filename if exists
    const [[category]] = await db.query(
      "SELECT photo FROM categories WHERE id = ?",
      [categoryId]
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // 3. Delete the category
    await db.query("DELETE FROM categories WHERE id = ?", [categoryId]);

    // 4. Delete the photo from disk if present
    if (category.photo) {
      const photoPath = path.join("uploads", category.photo);
      fs.unlink(photoPath, (err) => {
        if (err) {
          // Don't fail on file error, just log it
          console.error("Error deleting category photo:", err);
        }
      });
    }

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteSubCategory = async (req, res) => {
  const subCategoryId = req.params.id;
  try {
    // Get the photo filename if exists
    const [[subcategory]] = await db.query(
      "SELECT photo FROM subcategories WHERE id = ?",
      [subCategoryId]
    );
    if (!subcategory) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }

    // Delete the subcategory
    await db.query("DELETE FROM subcategories WHERE id = ?", [subCategoryId]);

    // Delete the photo from disk if present
    if (subcategory.photo) {
      const photoPath = path.join("uploads", subcategory.photo);
      fs.unlink(photoPath, (err) => {
        if (err) {
          // Don't fail on file error, just log it
          console.error("Error deleting subcategory photo:", err);
        }
      });
    }

    res.json({ success: true, message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addCategory = async (req, res) => {
  try {
    const {
      category_name,
      serialNumber,
      slug_name,
      metaKeyword,
      meta_description,
      status = 1,
      is_feature = 0,
    } = req.body;

    const photo = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO categories 
      (category_name, serialNumber, slug_name, photo, metaKeyword, meta_description, status, is_feature) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      category_name,
      serialNumber,
      slug_name,
      photo,
      metaKeyword,
      meta_description,
      status,
      is_feature,
    ]);

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addSubCategory = async (req, res) => {
  try {
    const { name, slug, main_category_id, status = 1 } = req.body;

    const photo = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO subcategories (name, slug, photo, main_category_id, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      name,
      slug,
      photo,
      main_category_id,
      status,
    ]);

    res.status(201).json({
      success: true,
      message: "Subcategory added successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const sql = `SELECT * FROM categories`;
    const [categories] = await db.query(sql);

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSubcategory = async (req, res) => {
  try {
    const sql = `SELECT * FROM subcategories`;
    const [subcategories] = await db.query(sql);

    res.status(200).json({
      success: true,
      subcategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM categories WHERE id = ?`;
    const [category] = await db.query(sql, [id]);

    if (category.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      category: category[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM subcategories WHERE id = ?`;
    const [subcategory] = await db.query(sql, [id]);

    if (subcategory.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }

    res.status(200).json({
      success: true,
      subcategory: subcategory[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// export const updateCategory = async (req, res) => {};

export const updateCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    // Step 1: Fetch existing category to get the old photo
    const [existingRows] = await db.query(
      "SELECT photo FROM categories WHERE id = ?",
      [categoryId]
    );
    if (existingRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    const existingPhoto = existingRows[0].photo;

    const {
      category_name,
      serialNumber,
      slug_name,
      metaKeyword,
      meta_description,
      status = 1,
      is_feature = 0,
    } = req.body;

    let newPhoto = existingPhoto;

    // Step 2: If new file uploaded
    if (req.file) {
      newPhoto = req.file.filename;

      // Delete old image file
      if (existingPhoto) {
        const oldPath = path.join("uploads", existingPhoto);
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error deleting old photo:", err);
        });
      }
    }

    // Step 3: Update the category
    const sql = `
      UPDATE categories 
      SET category_name = ?, serialNumber = ?, slug_name = ?, photo = ?, metaKeyword = ?, meta_description = ?, status = ?, is_feature = ?
      WHERE id = ?
    `;
    await db.query(sql, [
      category_name,
      serialNumber,
      slug_name,
      newPhoto,
      metaKeyword,
      meta_description,
      status,
      is_feature,
      categoryId,
    ]);

    res.json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const updateSubCategory = async (req, res) => {
  const subCategoryId = req.params.id;

  try {
    // Step 1: Get existing subcategory to check if a photo exists
    const [existingRows] = await db.query(
      "SELECT photo FROM subcategories WHERE id = ?",
      [subCategoryId]
    );

    if (existingRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }

    const existingPhoto = existingRows[0].photo;
    const { name, slug, main_category_id, status = 1 } = req.body;

    let newPhoto = existingPhoto;

    // Step 2: If a new image is uploaded, replace the old one
    if (req.file) {
      newPhoto = req.file.filename;

      if (existingPhoto) {
        const oldPath = path.join("uploads", existingPhoto);
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error deleting old subcategory photo:", err);
        });
      }
    }

    // Step 3: Update subcategory in the database
    const sql = `
      UPDATE subcategories 
      SET name = ?, slug = ?, main_category_id = ?, status = ?, photo = ?
      WHERE id = ?
    `;
    await db.query(sql, [
      name,
      slug,
      main_category_id,
      status,
      newPhoto,
      subCategoryId,
    ]);

    res.json({ success: true, message: "Subcategory updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// for Used Surveying Equipment all
export const getCateWithSubcateWithData = async (req, res) => {
  try {
    const id = req.params.id || 2; // fallback if no id passed

    // Get the category by ID
    const [categoryRows] = await db.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    if (categoryRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const category = categoryRows[0];

    // Get subcategories
    const [subcategories] = await db.query(
      "SELECT * FROM subcategories WHERE main_category_id = ?",
      [category.id]
    );

    // Match products with this category slug_name in JSON string
    const slug = category.slug_name;
    const [products] = await db.query(
      "SELECT * FROM products WHERE category LIKE ?",
      [`%"cat":"${slug}"%`]
    );

    res.status(200).json({
      success: true,
      // category,
      subcategories,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// for home page top 5 categories
export const getTopCategories = async (req, res) => {
  try {
    const sql = `SELECT * FROM categories ORDER BY serialNumber ASC LIMIT 5`;
    const [categories] = await db.query(sql);

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};