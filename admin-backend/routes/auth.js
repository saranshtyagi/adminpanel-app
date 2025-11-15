const express = require('express');
const z = require('zod');
const { login, signUp } = require('../controllers/auth');
const validate = require('../middlewares/validation');


const router = express.Router();

const signUpSchema = z.object({ 
    email: z.string().email(),
    password: z.string().min(6),    
    phone: z.string().optional(),
});

const loginSchema = z.object({  
    email: z.string().email(),
    password: z.string().min(6), 
});

const googleSchema = z.object({
    idToken: z.string(),
}); 

// router.post("/signup", validate(signUpSchema), signUp); 
router.post(
  "/signup",
  (req, res, next) => {
    console.log("📥 Request body received:", req.body);
    next();
  },
  validate(signUpSchema),
  (req, res, next) => {
    console.log("✅ Validation passed");
    next();
  },
  signUp
);


router.post("/login", validate(loginSchema), login);

module.exports = router;