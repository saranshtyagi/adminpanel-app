const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const logger = require("../utils/logger");
const { sendEmailWithRetry } = require("../utils/emailQueue");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function signUp(req, res) {
  const { email, password, phone } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, phone },
    });
    const token = jwt.sign({ userId: user?.id }, process.env.JWT_SECRET);
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
      to: user?.email,
      subject: "Welcome to Our Platform",
      html: `
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;'>
            <img src="https://media.istockphoto.com/id/1321617070/vector/health-medical-logo.jpg?s=612x612&w=0&k=20&c=sus8vhG3c__vCdvOBLDhuf2vPUgIAudIAeUBApU_7Ew=" alt="App Logo" style="width: 100px; display: block; margin: 0 auto 20px" />
            <h1 style="color: #16a34a; text-align: center;">Welcome to Our Platform!</h1>
            <p style="font-size: 16px;">Hey, There! Welcome to our Platform👋. If you have anu questions about our app, you can always reach out to us. We're here 24/7 for fast and reliable support. We're happy to help</p>
            <p style="font-size: 12px; color: #666; text-align: center;">Reply to this message or open it in the App</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666; text-align: center;">If you no longer wish to recieve this emails, <a href="https://yourapp.com/unsubscribe?email=${encodeURIComponent(
              user?.email
            )}" style="color: #2563eb;">Unsubscribe here</a>.</p>
            </div>
            `,
    };
    sendEmailWithRetry(mailOptions).catch((error) =>
      logger.error(
        `Failed to send welcome email to ${user?.email}: ${error.message}`
      )
    );
    res.json({ user, token });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

// async function signUp(req, res) {
//     console.log("✅ Entered signUp controller");
//     console.log("📦 Request body in controller:", req.body);

//     const { email, password, phone } = req.body;

//     try {
//         console.log("🔍 Checking existing user:", email);
//         const existingUser = await prisma.user.findUnique({ where: { email } });
//         console.log("👤 existingUser:", existingUser);

//         if (existingUser) {
//             console.log("❌ User already exists");
//             return res.status(400).json({ message: "User already exists" });
//         }

//         console.log("🔐 Hashing password...");
//         const hashedPassword = await bcrypt.hash(password, 10);
//         console.log("✅ Password hashed");

//         console.log("📝 Creating new user in database...");
//         const user = await prisma.user.create({
//             data: { email, password: hashedPassword, phone },
//         });
//         console.log("✅ User created:", user);

//         console.log("🔑 Generating JWT...");
//         console.log("🔍 JWT_SECRET =", process.env.JWT_SECRET);
//         const token = jwt.sign({ userId: user?.id }, process.env.JWT_SECRET);
//         console.log("✅ JWT generated");

//         // 📨 TEMPORARILY DISABLED EMAIL (restore later)
//         /*
//         console.log("📨 Sending welcome email...");
//         const mailOptions = {
//             from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
//             to: user?.email,
//             subject: "Welcome to Our Platform",
//             html: "<h1>Welcome!</h1>"
//         };

//         await sendEmailWithRetry(mailOptions);
//         console.log("✅ Email queued");
//         */

//         console.log("✅ Sending response to client");
//         return res.json({ user, token });

//     } catch (error) {
//         console.error("🔥 SIGNUP ERROR (controller):", error);
//         logger.error(error);

//         return res.status(500).json({
//             error: "Internal server error",
//             details: error.message,
//         });
//     }
// }

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user?.id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function googleLogin(req, res) {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await prisma.user.findFirst({
      where: { googleId },
    });
    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId },
        });
      } else {
        user = await prisma.user.create({
          data: { email, googleId, name },
        });
      }
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET,);
    res.json({ user, token });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

module.exports = { signUp, login, googleLogin };
