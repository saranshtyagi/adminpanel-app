
const z = require("zod"); 
const { getOrders, getUserOrders, getOrder, createRazorpayOrder, createOrder } = require("../controllers/orders");
const express = require('express');
const validate = require('../middlewares/validation');
const router = express.Router();
const authenticateToken = require('../middlewares/auth')

const razorpaySchema = z.object({
    amount: z.number().positive(), 
    currency: z.string(), 
    receipt: z.string(),
}); 

const orderSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().positive(),
        price: z.number().positive(),
    })), 
    totalAmount: z.number().positive(),
    address: z.object({}), 
    paymentMethod: z.string(), 
    paymentId: z.string().optional(),
    razorpayOrderId: z.string().optional(),
})

router.get('/', getOrders);
router.get("/my-orders", authenticateToken, getUserOrders); 
router.get('/:id', getOrder);
router.post("/create-razorpay-order", authenticateToken, validate(razorpaySchema), createRazorpayOrder);
router.post('/', authenticateToken, validate(orderSchema), createOrder);

module.exports = router;