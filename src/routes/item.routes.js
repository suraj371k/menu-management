import express from 'express'
import { upload } from '../middleware/upload.js'
import { createItems, deleteItem, getAllItems, getIitemsBySubCategories, getItemsByCategories, getItemsById, updateItems } from '../controllers/item.controller.js'
const router = express.Router()

router.post('/create' , upload.single('image') , createItems)

router.get('/' , getAllItems)

router.get('/:id' , getItemsById)

router.get('/:categoryId/categories' , getItemsByCategories)

router.get('/:id/subCategories' , getIitemsBySubCategories)

router.put('/:id' , updateItems)

router.delete('/:id' , deleteItem)

export default router