import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  updateSubCategory,
} from "../controllers/subCategory.controller.js";
import { upload } from "../middleware/upload.js";
const router = express.Router();

router.post("/create", upload.single("image"), createSubCategory);

router.get("/", getSubCategories);

router.delete("/:id", deleteSubCategory);

router.put("/:id", updateSubCategory);

router.get("/:id", getSubCategoryById);

router.get('/:categoryId/categories' , getSubCategoriesByCategory)

export default router;
