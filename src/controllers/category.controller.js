import cloudinary from "../config/cloudinary.js";
import Category from "../models/category.models.js";
import fs from "fs";

export const createCategory = async (req, res) => {
  try {
    const { name, description, taxApplicability, tax, taxType } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    let uploadedImage;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        uploadedImage = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Image upload failed" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const category = new Category({
      name,
      description,
      taxApplicability,
      tax,
      taxType,
      image: uploadedImage,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("createCategory error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories) {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }

    return res.status(200).json({
      success: false,
      message: "categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("getCategory error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting  category",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    return res.status(200).json({
      success: false,
      message: "category by id fetched successfully",
      category,
    });
  } catch (error) {
    console.error("getCategory by id error:", error);
    res.status(500).json({
      success: false,
      message: "Error in  getting  category by id",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await Category.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "category deleted successfully" });
  } catch (error) {
    console.error("delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Error in delete category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, taxApplicability, tax, taxType } =
      req.body || {};

    const category = await Category.findById(id);

    if (name) category.name = name;
    if (description) category.description = description;
    if (taxApplicability) category.taxApplicability = taxApplicability;
    if (tax) category.tax = tax;
    if (taxType) category.taxType = taxType;

    //update the image if new file is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      if (category.image) {
        const publicId = getCloudinaryPublicId(category.image);
        await cloudinary.uploader.destroy(publicId);
      }

      category.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    await category.save();

    return res.status(200).json({
      success: true,
      message: "category updated successfully",
      category,
    });
  } catch (error) {
    console.error("update category error:", error);
    res.status(500).json({
      success: false,
      message: "Error in  update category",
      error: error.message,
    });
  }
};
