import express from 'express'
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/category.controller.js'
import { upload } from '../middleware/upload.js'
const router = express.Router()

router.post('/create', upload.single('image') , createCategory)

router.get('/' , getAllCategories)

router.get('/:id' , getCategoryById)

router.delete('/:id' , deleteCategory)

router.put('/:id' , updateCategory)

export default router