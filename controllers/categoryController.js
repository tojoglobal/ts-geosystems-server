import db from "../Utils/db.js";

import fs from "fs";
import path from "path";

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
    console.error("Error in addCategory:", error);
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
    console.error("Error in addSubCategory:", error);
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
    console.error("Error in getCategory:", error);
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
    console.error("Error in getSubcategory:", error);
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
    console.error("Error in getCategoryById:", error);
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
    console.error("Error in getSubCategoryById:", error);
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
    console.error("Error in updateCategory:", error);
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
    console.error("Error in updateSubCategory:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
