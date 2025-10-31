const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getProducts(req, res) {
    const { categoryId, page=1, limit=10} = req.query; 
    const skip = (page - 1) * limit;
    const where = categoryId ? {categoryId} : {};
    const products = await prisma.product.findMany({
        where, 
        skip: +skip,
        take: +limit,
    });
    res.json(products);
}

async function getProduct(req, res) {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: { id },
    });
    if(!product) {
        return res.status(404).json({ error: "Product not found"});
    }
    res.json(product);
}

async function updateProduct(req, res) {
    const { id } = req.params;
    const {name, price, imageUrl, description} = req.body;

    const product = await prisma.product.update({
        where: { id },
        data: { name, price, imageUrl, description },
    });
    res.json(product);
}

async function createProduct(req, res) {
    const { categoryId, name, price, imageUrl, description } = req.body;
    const product = await prisma.product.create({
        data: { categoryId, name, price, imageUrl, description },
    });
    res.json(product);
}

async function deleteProduct(req, res) {
    const { id } = req.params;
    await prisma.product.delete({
        where: { id },
    });
    res.json({ message: "Product deleted"});
}

module.exports = { getProducts, getProduct, updateProduct, createProduct, deleteProduct };