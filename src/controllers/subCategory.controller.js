import cloudinary from "../config/cloudinary.js";
import SubCategory from "../models/subCategory.models.js";
import Category from "../models/category.models.js";
import fs from "fs";
import mongoose from "mongoose";

// Helper to extract Cloudinary public ID from URL
const getCloudinaryPublicId = (url) => {
  const parts = url.split("/");
  const file = parts[parts.length - 1];
  const [publicId] = file.split(".");
  return publicId;
};

// Create a subcategory
export const createSubCategory = async (req, res) => {
  try {
    const { name, description, category: categoryId } = req.body || {};

    if (!name || !description || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (name, description, category)",
      });
    }

    // Fetch parent category to inherit taxes
    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found",
      });
    }

    // Upload image to Cloudinary
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    let uploadedImage;
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      uploadedImage = result.secure_url;
      fs.unlinkSync(req.file.path); // delete local file
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }

    // Create subcategory with inherited taxes
    const subCategory = await SubCategory.create({
      name,
      description,
      image: uploadedImage,
      category: categoryId,
      taxApplicability: parentCategory.taxApplicability,
      tax: parentCategory.tax,
    });

    return res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      data: subCategory,
    });
  } catch (error) {
    console.error("Error in create subcategory controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all subcategories
export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate(
      "category",
      "name taxApplicability tax"
    );

    return res.status(200).json({
      success: true,
      message: "SubCategories fetched successfully",
      data: subCategories,
    });
  } catch (error) {
    console.error("Error in get subcategory controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get subcategory by ID
export const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id).populate(
      "category",
      "name taxApplicability tax"
    );
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategory fetched successfully",
      data: subCategory,
    });
  } catch (error) {
    console.error("Error in getSubCategoryById controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update subcategory
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category: newCategoryId } = req.body || {};

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found" });
    }

    // Update text fields if provided
    if (name) subCategory.name = name;
    if (description) subCategory.description = description;

    // Update category (and inherit tax if changed)
    if (newCategoryId && newCategoryId !== subCategory.category.toString()) {
      const newCategory = await Category.findById(newCategoryId);
      if (!newCategory) {
        return res
          .status(404)
          .json({ success: false, message: "New category not found" });
      }
      subCategory.category = newCategoryId;
      subCategory.taxApplicability = newCategory.taxApplicability;
      subCategory.tax = newCategory.tax;
    }

    // Update image if uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      // Delete old image
      if (subCategory.image) {
        const publicId = getCloudinaryPublicId(subCategory.image);
        await cloudinary.uploader.destroy(publicId);
      }

      subCategory.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    await subCategory.save();

    return res.status(200).json({
      success: true,
      message: "SubCategory updated successfully",
      data: subCategory,
    });
  } catch (error) {
    console.error("Error in update subcategory controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found" });
    }

    // Delete image from Cloudinary
    if (subCategory.image) {
      const publicId = getCloudinaryPublicId(subCategory.image);
      await cloudinary.uploader.destroy(publicId);
    }

    await SubCategory.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "SubCategory deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleting subcategory controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//get sub category under the spefic category
export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const subCategories = await SubCategory.find({ category: categoryId })
      .populate("category", "name taxApplicability tax")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: `SubCategories for category ${categoryId} fetched successfully`,
      data: subCategories,
    });
  } catch (error) {
    console.error("Error in getSubCategoriesByCategory controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
