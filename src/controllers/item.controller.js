import cloudinary from "../config/cloudinary.js";
import Category from "../models/category.models.js";
import Item from "../models/items.model.js";
import fs from "fs";
import SubCategory from "../models/subCategory.models.js";

//create items
export const createItems = async (req, res) => {
  try {
    const {
      name,
      description,
      taxApplicability = false,
      tax = 0,
      baseAmount,
      discount = 0,
      category,
      subCategory,
    } = req.body;

    // Validate required fields
    if (!name || !description || !baseAmount || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Upload image to Cloudinary (if provided)
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

    //  Calculate totalAmount correctly
    const totalAmount =
      baseAmount - discount + (taxApplicability ? (baseAmount * tax) / 100 : 0);

    //  Create the item
    const item = await Item.create({
      name,
      description,
      taxApplicability,
      tax,
      baseAmount,
      discount,
      totalAmount,
      category,
      subCategory,
      image: uploadedImage,
    });

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      item,
    });
  } catch (error) {
    console.error("Error in createItems controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("category", "name taxApplicability tax")
      .populate("subCategory", "name taxApplicability tax");

    return res
      .status(200)
      .json({ success: true, message: "items fetch successfully", items });
  } catch (error) {
    console.error("Error in get all items  controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//get items by id
export const getItemsById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id)
      .populate("category", "name , taxApplicability tax")
      .populate("subCategory", "name , taxApplicability , tax");

    return res
      .status(200)
      .json({ success: true, message: "item fetched successfully", item });
  } catch (error) {
    console.error("Error in get items  by id controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//get items by categories
export const getItemsByCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }

    const items = await Item.find({ category: categoryId })
      .populate("category", "name taxApplicability tax")
      .populate("subCategory", "name taxApplicability tax");

    return res.status(200).json({
      success: true,
      message: "item by category fetched successfully",
      items,
    });
  } catch (error) {
    console.error("Error in get items  by id controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//get items by subcategories
export const getIitemsBySubCategories = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "sub category not found" });
    }
    const items = await Item.find({ subCategory: id })
      .populate("category", "name  taxApplicability  tax")
      .populate("subCategory", "name taxApplicability tax");

    return res.status(200).json({
      success: true,
      message: "items by sub category fetched successfully",
      items,
    });
  } catch (error) {
    console.log("Error in getting items by sub categories controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
};


//update controller
export const updateItems = async (req, res) => {
  try {
    const {
      name,
      description,
      taxApplicability = false,
      tax = 0,
      baseAmount,
      discount = 0,
      category,
      subCategory,
    } = req.body;

    const { id } = req.params;

    // Find item by ID
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Upload new image if provided
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "menu-items",
        });
        item.image = result.secure_url;
        item.imagePublicId = result.public_id;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res
          .status(400)
          .json({ success: false, message: "Image upload failed" });
      }
    }

    // Update fields dynamically
    if (name) item.name = name;
    if (description) item.description = description;
    item.taxApplicability = taxApplicability;
    item.tax = tax;
    if (baseAmount) item.baseAmount = baseAmount;
    if (discount) item.discount = discount;
    if (category) item.category = category;
    if (subCategory) item.subCategory = subCategory;

    // Save the updated item
    const updatedItem = await item.save();

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error in updating item controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//delete controller
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (error) {
        console.warn("Error deleting image from Cloudinary:", error);
      }
    }

    await Item.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error in delete item controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// Search items by name or description (optionally filter by category/subcategory)
export const searchItems = async (req, res) => {
  try {
    const { query, category, subCategory } = req.query;

    // Ensure a search term is provided
    if (!query || query.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    // Build dynamic MongoDB filter
    const searchFilter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    };

    // Optional category/subcategory filters
    if (category) searchFilter.category = category;
    if (subCategory) searchFilter.subCategory = subCategory;

    // Fetch matching items
    const items = await Item.find(searchFilter)
      .populate("category", "name taxApplicability tax")
      .populate("subCategory", "name taxApplicability tax");

    return res.status(200).json({
      success: true,
      message: "Search results fetched successfully",
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Error in searchItems controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
