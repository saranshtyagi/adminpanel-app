import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/products';

const express = require('express');
const validate = require('../middleware/validation');
const z = require("zod"); 

const router = express.Router();

const productSchema = z.object({
    categoryId:z.string(), 
    name:z.string().min(1), 
    price:z.number().positive(), 
    imageUrl:z.string().optional(), 
    description:z.string().optional()
})

const updateProductSchema = z.object({
    name:z.string().min(1).optional(),
    price:z.number().positive().optional(),
    imageUrl:z.string().optional(),
    description:z.string().optional()
})

router.get('/', getProducts); 
router.get('/:id', getProduct); 
router.post('/', validate(productSchema), createProduct);
router.post('/:id', validate(updateProductSchema), updateProduct); 
router.delete('/:id', deleteProduct)

module.exports = router;