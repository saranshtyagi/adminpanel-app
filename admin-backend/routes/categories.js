const express = require("express"); 
const validate = require("../middlewares/validation");

const z = require("zod"); 
const { getCategories, getProductByCategory, createCategory, updateCategory, deleteCategory } = require("../controllers/categories"); 

const router = express.Router(); 

const categorySchema = z.object({
    name: z.string().min(1), 
    imageUrl: z.string().url().optional().or(z.literal(''))
})

router.get("/", getCategories); 
router.get("/:id/products", getProductByCategory); 
router.post('/', validate(categorySchema), createCategory); 
router.put('/:id', validate(categorySchema), updateCategory); 
router.delete('/:id', deleteCategory);

module.exports = router;