require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth")
const crypto = require("crypto");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const { errorHandler } = require("./middlewares/errorHandler.js");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/users");
const logger = require("./utils/logger");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

app.use(helmet());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
}));

app.use(cors({
    origin: ["http://localhost:3000", "http://10.170.169.4:3000", "*"]
}));


app.use(express.json());
// app.use(bodyParser.raw({ type: "application/json" }));

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.post("/debug", (req, res) => {
    console.log("✅ Received body:", req.body);
    res.send("ok");
});
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", userRoutes);

app.post("/api/v1/webhook", async(req, res) => {
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    try {
        const shashum = crypto.createHmac("sha256", webhookSecret);
        shashum.update(req.body, "utf-8");

        const digest = shashum.digest("hex");

        if(signature === digest) {
            const event = req.body; 
            if(event.event === "payment.captured") {
                const { order_id, payment_id } = event.payload.payment.entity;
                await prisma.order.update({
                    where: { razorpayOrderId: order_id },
                    data: { paymentId: payment_id, status: "Paid" },
                });
            }
            res.status(200).end();
        }
        else {
            res.status(400).end();
        }
    } catch (error) {
        logger.error(error);
        res.status(500).end();
    }
})

app.use(errorHandler);

app.listen(3001, () => logger.info("Server running on http://localhost:3001"));