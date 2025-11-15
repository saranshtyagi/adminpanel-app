
const { sendEmailWithRetry } = require('../utils/emailQueue');
const logger = require('../utils/logger');

const RazorPay = require('razorpay'); 
const PDFDocument = require('pdfkit');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const razorpay = new RazorPay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

async function getOrders(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const orders = await prisma.order.findMany({
        include: { user: true },
        skip: +skip,
        take: +limit,
    });
    res.json(orders);
}

async function getUserOrders(req, res) {
    const userId = req.user.userId; 
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await prisma.order.findMany({
        where: { userId },
        skip: +skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
}

async function getOrder(req, res) {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
        where: { id },
        include: { user: true },
    });
    res.json(order);
}

async function updateOrder(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.update({
        where: { id },
        data: { status },
    });
    res.json(order);
}

async function createRazorpayOrder(req, res) {
    const { amount, currency, receipt } = req.body;
    const order = await razorpay.create({amount, currency, receipt});
    res.json(order);
}

async function createOrder(req, res) {
    const {items, totalAmount, address, paymentMethod, paymentId, razorpayOrderId} = req.body;
    const order = prisma.order.create({
        data: {
            userId: req.user.userId,
            items, 
            totalAmount,
            address, 
            paymentMethod,
            paymentId,
            razorpayOrderId,
            status: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        }
    }); 
    const user = await prisma.user.findUnique({where:{id:req.user.userId}});
    if(!user || !user.email) {
        logger.warn("No email found for user"); 
        return res.json(order);
    }
    const pdfDoc = new PDFDocument();
    let buffers = []; 
    pdfDoc.on("data", buffers.push.bind(buffers));
    pdfDoc.on("end", async () => {
        const pdfBuffer = Buffer.concat(buffers);
        let itemsHtml = "<ul>";
        items.forEach((item) => {
            itemsHtml += `<li>${item.quantity} x ${item.productId} - ₹${item.price}</li>`;
        });
        itemsHtml += "</ul>";

        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Thank you for your order! #${order.id}`, 
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <img src="https://media.istockphoto.com/id/1321617070/vector/health-medical-logo.jpg?s=612x612&w=0&k=20&c=sus8vhG3c__vCdvOBLDhuf2vPUgIAudIAeUBApU_7Ew=" alt="Logo" style="width: 100px; display: block; margin: 0 auto 20px;" />
                <h1 style="color: #16a34a; text-align: center;">Thank You for your order!</h1>
                <p style="font-size: 16px;">Your Order #${
                    order.id
                } has been placed successfully. Here's a summary:</p>
                ${itemsHtml}
                <p style="font-size: 16px;"><strong>Total: ₹${totalAmount}</strong></p>
                <p style="font-size: 16px;">Delivery Address: ${address.flatNo}, ${
                    address.blockName}, ${address.locality} - ${address.pincode}</p>
                     <p style="font-size: 16px;">Payment Method: ${paymentMethod}</p>
                     <p style="font-size: 16px;">We've attached your invoice as a PDF for your records.</p>
                     <a href="https://yourapp.com/orders/${
                        order.id
                     }" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; display: block; text-align: center; margin: 20px auto; width: fit-content;">View Order Details</a>
                     <p style="font-size: 12px; color: #666; text-align: center;">If you have any questions, reply to this email.</p>
                     <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                     <p style="font-size: 12px; color: #666; text-align: center;">If you no longer wish to receive these emails, <a href="https://yourapp.com/unsubscribe?email=${encodeURIComponent(
                        user.email
                     )}" style="color: #2563eb;">unsubscribe here</a>.</p>
                }</p>
            </div>
            `, 
            attachements: [
                {
                    fileName: `invoice-${order.id}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                },
            ], 
        }; 
        sendEmailWithRetry(mailOptions).catch(error => logger.error(`Failed to send order confirmation email to ${user.email}: ${error.message}`));
    });

    pdfDoc.fontSize(20).text("Invoice", {align: "center"});
    pdfDoc.fontSize(12).text(`Order ID: ${order.id}`);
    pdfDoc.text(`Date: ${new Date().toLocaleDateString()}`);
    pdfDoc.moveDown();
    pdfDoc.text("Items:");
    items.forEach((item) => {
        pdfDoc.text(
            `${item.quantity} x Product ID ${item.productId} - ₹${item.price}`
        );
    });
    pdfDoc.moveDown();
    pdfDoc.text(`Total Amount: ₹${totalAmount}`, {align: "right"});
    pdfDoc.text(`Payment Method: ${paymentMethod}`);
    pdfDoc.moveDown();
    pdfDoc.text("Delivery Address:");
    pdfDoc.text(`${address.name}`); 
    pdfDoc.text(`${address.flatNo}, ${address.blockName}`); 
    pdfDoc.text(`${address.locality} - ${address.pincode}`);
    pdfDoc.end();
    res.json(order);
}

module.exports = { getOrders, getUserOrders, getOrder, updateOrder, createRazorpayOrder, createOrder };