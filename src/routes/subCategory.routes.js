import express from 'express'
import { createSubCategory } from '../controllers/subCategory.controller.js'
import { upload } from '../middleware/upload.js'
const router = express.Router()

router.post('/create', upload.single('image') , createSubCategory)

export default router