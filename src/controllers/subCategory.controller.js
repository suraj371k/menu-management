import cloudinary from "../config/cloudinary.js";
import SubCategory from "../models/subCategory.models.js";
import Category from "../models/category.models.js"; 

export const createSubCategory = async (req, res) => {
  try {
    const { name, description, category: categoryId } = req.body;

    if (!name || !description || !categoryId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields (name, description, category)" 
      });
    }

    // Fetch parent category to inherit taxes
    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
      return res.status(404).json({ 
        success: false, 
        message: "Parent category not found" 
      });
    }

    // Upload image to Cloudinary
    let uploadedImage;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        uploadedImage = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
    } else {
      return res.status(400).json({ success: false, message: "Image is required" });
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
      error: error.message 
    });
  }
};
